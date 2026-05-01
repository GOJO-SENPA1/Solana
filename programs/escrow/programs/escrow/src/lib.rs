use anchor_lang::prelude::*;
use anchor_lang::solana_program::hash::hash;
use anchor_lang::system_program;

declare_id!("2AeboQZoaSyBoC2YRcVHvL9CYh5embbddQ6pFubCKdoZ");

#[program]
pub mod escrow {
    use super::*;

    pub fn create_escrow(
        ctx: Context<CreateEscrow>,
        escrow_id: [u8; 16],
        claim_hash: [u8; 32],
        amount_lamports: u64,
    ) -> Result<()> {
        require!(amount_lamports > 0, EscrowError::InvalidAmount);

        let escrow = &mut ctx.accounts.escrow;
        escrow.bump = ctx.bumps.escrow;
        escrow.escrow_id = escrow_id;
        escrow.sender = ctx.accounts.sender.key();
        escrow.amount_lamports = amount_lamports;
        escrow.claim_hash = claim_hash;
        escrow.status = EscrowStatus::Created;

        // Deposit lamports from sender into escrow PDA account.
        let ix = system_program::Transfer {
            from: ctx.accounts.sender.to_account_info(),
            to: ctx.accounts.escrow.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.system_program.to_account_info(), ix);
        system_program::transfer(cpi_ctx, amount_lamports)?;

        Ok(())
    }

    pub fn cancel_escrow(ctx: Context<CancelEscrow>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        require!(escrow.status == EscrowStatus::Created, EscrowError::NotCancellable);

        escrow.status = EscrowStatus::Cancelled;

        // Return funds to sender.
        transfer_from_escrow(
            &ctx.accounts.escrow,
            &ctx.accounts.sender.to_account_info(),
            ctx.accounts.escrow.amount_lamports,
        )?;

        Ok(())
    }

    pub fn claim_escrow(ctx: Context<ClaimEscrow>, claim_token: Vec<u8>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        require!(escrow.status == EscrowStatus::Created, EscrowError::NotClaimable);

        let computed = hash(&claim_token).to_bytes();
        require!(computed == escrow.claim_hash, EscrowError::InvalidClaimToken);

        escrow.status = EscrowStatus::Claimed;

        transfer_from_escrow(
            &ctx.accounts.escrow,
            &ctx.accounts.receiver.to_account_info(),
            ctx.accounts.escrow.amount_lamports,
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(escrow_id: [u8; 16])]
pub struct CreateEscrow<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(
        init,
        payer = sender,
        space = 8 + Escrow::INIT_SPACE,
        seeds = [b"escrow", sender.key().as_ref(), &escrow_id],
        bump
    )]
    pub escrow: Account<'info, Escrow>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CancelEscrow<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(
        mut,
        close = sender,
        has_one = sender,
        seeds = [b"escrow", sender.key().as_ref(), &escrow.escrow_id],
        bump = escrow.bump
    )]
    pub escrow: Account<'info, Escrow>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimEscrow<'info> {
    /// The receiver does not need to be known at creation time; any signer who
    /// knows the claim token can claim in this MVP.
    #[account(mut)]
    pub receiver: Signer<'info>,

    /// The original sender is used as part of the PDA seeds.
    /// Not required to sign for claim.
    pub sender: AccountInfo<'info>,

    #[account(
        mut,
        close = receiver,
        seeds = [b"escrow", sender.key().as_ref(), &escrow.escrow_id],
        bump = escrow.bump
    )]
    pub escrow: Account<'info, Escrow>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct Escrow {
    pub bump: u8,
    pub escrow_id: [u8; 16],
    pub sender: Pubkey,
    pub amount_lamports: u64,
    pub claim_hash: [u8; 32],
    pub status: EscrowStatus,
}

impl Escrow {
    pub const INIT_SPACE: usize =
        1  // bump
        + 16 // escrow_id
        + 32 // sender
        + 8  // amount_lamports
        + 32 // claim_hash
        + 1; // status
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum EscrowStatus {
    Created = 0,
    Claimed = 1,
    Cancelled = 2,
}

#[error_code]
pub enum EscrowError {
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Escrow is not claimable")]
    NotClaimable,
    #[msg("Escrow is not cancellable")]
    NotCancellable,
    #[msg("Invalid claim token")]
    InvalidClaimToken,
}

fn transfer_from_escrow(escrow: &Account<Escrow>, to: &AccountInfo, amount: u64) -> Result<()> {
    let escrow_info = escrow.to_account_info();
    **escrow_info.try_borrow_mut_lamports()? = escrow_info
        .lamports()
        .checked_sub(amount)
        .ok_or(EscrowError::InvalidAmount)?;
    **to.try_borrow_mut_lamports()? = to
        .lamports()
        .checked_add(amount)
        .ok_or(EscrowError::InvalidAmount)?;
    Ok(())
}

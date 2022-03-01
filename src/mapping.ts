import { BigInt } from "@graphprotocol/graph-ts"
import {
  LiquidityPool,
  AssetSent,
  Deposit,
  EthReceived,
  FeeDetails,
  GasFeeWithdraw,
  LiquidityProvidersChanged,
  OwnershipTransferred,
  Paused,
  PauserChanged,
  Received,
  TrustedForwarderChanged,
  Unpaused
} from "../generated/LiquidityPool/LiquidityPool"
import { ExampleEntity } from "../generated/schema"

export function handleAssetSent(event: AssetSent): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.asset = event.params.asset
  entity.amount = event.params.amount

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.baseGas(...)
  // - contract.checkHashStatus(...)
  // - contract.gasFeeAccumulated(...)
  // - contract.gasFeeAccumulatedByToken(...)
  // - contract.getCurrentLiquidity(...)
  // - contract.getExecutorManager(...)
  // - contract.getRewardAmount(...)
  // - contract.getTransferFee(...)
  // - contract.incentivePool(...)
  // - contract.isPauser(...)
  // - contract.isTrustedForwarder(...)
  // - contract.liquidityProviders(...)
  // - contract.owner(...)
  // - contract.paused(...)
  // - contract.processedHash(...)
  // - contract.tokenManager(...)
}

export function handleDeposit(event: Deposit): void {}

export function handleEthReceived(event: EthReceived): void {}

export function handleFeeDetails(event: FeeDetails): void {}

export function handleGasFeeWithdraw(event: GasFeeWithdraw): void {}

export function handleLiquidityProvidersChanged(
  event: LiquidityProvidersChanged
): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlePaused(event: Paused): void {}

export function handlePauserChanged(event: PauserChanged): void {}

export function handleReceived(event: Received): void {}

export function handleTrustedForwarderChanged(
  event: TrustedForwarderChanged
): void {}

export function handleUnpaused(event: Unpaused): void {}

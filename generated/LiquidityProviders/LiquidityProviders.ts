// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class EthReceived extends ethereum.Event {
  get params(): EthReceived__Params {
    return new EthReceived__Params(this);
  }
}

export class EthReceived__Params {
  _event: EthReceived;

  constructor(event: EthReceived) {
    this._event = event;
  }

  get sender(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get value(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class FeeAdded extends ethereum.Event {
  get params(): FeeAdded__Params {
    return new FeeAdded__Params(this);
  }
}

export class FeeAdded__Params {
  _event: FeeAdded;

  constructor(event: FeeAdded) {
    this._event = event;
  }

  get tokenAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get fee(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class FeeClaimed extends ethereum.Event {
  get params(): FeeClaimed__Params {
    return new FeeClaimed__Params(this);
  }
}

export class FeeClaimed__Params {
  _event: FeeClaimed;

  constructor(event: FeeClaimed) {
    this._event = event;
  }

  get tokenAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get fee(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get lp(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get sharesBurnt(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class LiquidityAdded extends ethereum.Event {
  get params(): LiquidityAdded__Params {
    return new LiquidityAdded__Params(this);
  }
}

export class LiquidityAdded__Params {
  _event: LiquidityAdded;

  constructor(event: LiquidityAdded) {
    this._event = event;
  }

  get tokenAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get lp(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class LiquidityRemoved extends ethereum.Event {
  get params(): LiquidityRemoved__Params {
    return new LiquidityRemoved__Params(this);
  }
}

export class LiquidityRemoved__Params {
  _event: LiquidityRemoved;

  constructor(event: LiquidityRemoved) {
    this._event = event;
  }

  get tokenAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get lp(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class Paused extends ethereum.Event {
  get params(): Paused__Params {
    return new Paused__Params(this);
  }
}

export class Paused__Params {
  _event: Paused;

  constructor(event: Paused) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class PauserChanged extends ethereum.Event {
  get params(): PauserChanged__Params {
    return new PauserChanged__Params(this);
  }
}

export class PauserChanged__Params {
  _event: PauserChanged;

  constructor(event: PauserChanged) {
    this._event = event;
  }

  get previousPauser(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newPauser(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class Unpaused extends ethereum.Event {
  get params(): Unpaused__Params {
    return new Unpaused__Params(this);
  }
}

export class Unpaused__Params {
  _event: Unpaused;

  constructor(event: Unpaused) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class LiquidityProviders extends ethereum.SmartContract {
  static bind(address: Address): LiquidityProviders {
    return new LiquidityProviders("LiquidityProviders", address);
  }

  BASE_DIVISOR(): BigInt {
    let result = super.call("BASE_DIVISOR", "BASE_DIVISOR():(uint256)", []);

    return result[0].toBigInt();
  }

  try_BASE_DIVISOR(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("BASE_DIVISOR", "BASE_DIVISOR():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getFeeAccumulatedOnNft(_nftId: BigInt): BigInt {
    let result = super.call(
      "getFeeAccumulatedOnNft",
      "getFeeAccumulatedOnNft(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(_nftId)]
    );

    return result[0].toBigInt();
  }

  try_getFeeAccumulatedOnNft(_nftId: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getFeeAccumulatedOnNft",
      "getFeeAccumulatedOnNft(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(_nftId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getSuppliedLiquidity(_nftId: BigInt): BigInt {
    let result = super.call(
      "getSuppliedLiquidity",
      "getSuppliedLiquidity(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(_nftId)]
    );

    return result[0].toBigInt();
  }

  try_getSuppliedLiquidity(_nftId: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getSuppliedLiquidity",
      "getSuppliedLiquidity(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(_nftId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getSuppliedLiquidityByToken(tokenAddress: Address): BigInt {
    let result = super.call(
      "getSuppliedLiquidityByToken",
      "getSuppliedLiquidityByToken(address):(uint256)",
      [ethereum.Value.fromAddress(tokenAddress)]
    );

    return result[0].toBigInt();
  }

  try_getSuppliedLiquidityByToken(
    tokenAddress: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getSuppliedLiquidityByToken",
      "getSuppliedLiquidityByToken(address):(uint256)",
      [ethereum.Value.fromAddress(tokenAddress)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getTokenPriceInLPShares(_baseToken: Address): BigInt {
    let result = super.call(
      "getTokenPriceInLPShares",
      "getTokenPriceInLPShares(address):(uint256)",
      [ethereum.Value.fromAddress(_baseToken)]
    );

    return result[0].toBigInt();
  }

  try_getTokenPriceInLPShares(
    _baseToken: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getTokenPriceInLPShares",
      "getTokenPriceInLPShares(address):(uint256)",
      [ethereum.Value.fromAddress(_baseToken)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getTotalLPFeeByToken(tokenAddress: Address): BigInt {
    let result = super.call(
      "getTotalLPFeeByToken",
      "getTotalLPFeeByToken(address):(uint256)",
      [ethereum.Value.fromAddress(tokenAddress)]
    );

    return result[0].toBigInt();
  }

  try_getTotalLPFeeByToken(tokenAddress: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getTotalLPFeeByToken",
      "getTotalLPFeeByToken(address):(uint256)",
      [ethereum.Value.fromAddress(tokenAddress)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getTotalReserveByToken(tokenAddress: Address): BigInt {
    let result = super.call(
      "getTotalReserveByToken",
      "getTotalReserveByToken(address):(uint256)",
      [ethereum.Value.fromAddress(tokenAddress)]
    );

    return result[0].toBigInt();
  }

  try_getTotalReserveByToken(
    tokenAddress: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getTotalReserveByToken",
      "getTotalReserveByToken(address):(uint256)",
      [ethereum.Value.fromAddress(tokenAddress)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  isPauser(pauser: Address): boolean {
    let result = super.call("isPauser", "isPauser(address):(bool)", [
      ethereum.Value.fromAddress(pauser)
    ]);

    return result[0].toBoolean();
  }

  try_isPauser(pauser: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall("isPauser", "isPauser(address):(bool)", [
      ethereum.Value.fromAddress(pauser)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  isTrustedForwarder(forwarder: Address): boolean {
    let result = super.call(
      "isTrustedForwarder",
      "isTrustedForwarder(address):(bool)",
      [ethereum.Value.fromAddress(forwarder)]
    );

    return result[0].toBoolean();
  }

  try_isTrustedForwarder(forwarder: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isTrustedForwarder",
      "isTrustedForwarder(address):(bool)",
      [ethereum.Value.fromAddress(forwarder)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  paused(): boolean {
    let result = super.call("paused", "paused():(bool)", []);

    return result[0].toBoolean();
  }

  try_paused(): ethereum.CallResult<boolean> {
    let result = super.tryCall("paused", "paused():(bool)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  sharesToTokenAmount(_shares: BigInt, _tokenAddress: Address): BigInt {
    let result = super.call(
      "sharesToTokenAmount",
      "sharesToTokenAmount(uint256,address):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(_shares),
        ethereum.Value.fromAddress(_tokenAddress)
      ]
    );

    return result[0].toBigInt();
  }

  try_sharesToTokenAmount(
    _shares: BigInt,
    _tokenAddress: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "sharesToTokenAmount",
      "sharesToTokenAmount(uint256,address):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(_shares),
        ethereum.Value.fromAddress(_tokenAddress)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  totalLPFees(param0: Address): BigInt {
    let result = super.call("totalLPFees", "totalLPFees(address):(uint256)", [
      ethereum.Value.fromAddress(param0)
    ]);

    return result[0].toBigInt();
  }

  try_totalLPFees(param0: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "totalLPFees",
      "totalLPFees(address):(uint256)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  totalLiquidity(param0: Address): BigInt {
    let result = super.call(
      "totalLiquidity",
      "totalLiquidity(address):(uint256)",
      [ethereum.Value.fromAddress(param0)]
    );

    return result[0].toBigInt();
  }

  try_totalLiquidity(param0: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "totalLiquidity",
      "totalLiquidity(address):(uint256)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  totalReserve(param0: Address): BigInt {
    let result = super.call("totalReserve", "totalReserve(address):(uint256)", [
      ethereum.Value.fromAddress(param0)
    ]);

    return result[0].toBigInt();
  }

  try_totalReserve(param0: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "totalReserve",
      "totalReserve(address):(uint256)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  totalSharesMinted(param0: Address): BigInt {
    let result = super.call(
      "totalSharesMinted",
      "totalSharesMinted(address):(uint256)",
      [ethereum.Value.fromAddress(param0)]
    );

    return result[0].toBigInt();
  }

  try_totalSharesMinted(param0: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "totalSharesMinted",
      "totalSharesMinted(address):(uint256)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class AddLPFeeCall extends ethereum.Call {
  get inputs(): AddLPFeeCall__Inputs {
    return new AddLPFeeCall__Inputs(this);
  }

  get outputs(): AddLPFeeCall__Outputs {
    return new AddLPFeeCall__Outputs(this);
  }
}

export class AddLPFeeCall__Inputs {
  _call: AddLPFeeCall;

  constructor(call: AddLPFeeCall) {
    this._call = call;
  }

  get _token(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class AddLPFeeCall__Outputs {
  _call: AddLPFeeCall;

  constructor(call: AddLPFeeCall) {
    this._call = call;
  }
}

export class AddNativeLiquidityCall extends ethereum.Call {
  get inputs(): AddNativeLiquidityCall__Inputs {
    return new AddNativeLiquidityCall__Inputs(this);
  }

  get outputs(): AddNativeLiquidityCall__Outputs {
    return new AddNativeLiquidityCall__Outputs(this);
  }
}

export class AddNativeLiquidityCall__Inputs {
  _call: AddNativeLiquidityCall;

  constructor(call: AddNativeLiquidityCall) {
    this._call = call;
  }
}

export class AddNativeLiquidityCall__Outputs {
  _call: AddNativeLiquidityCall;

  constructor(call: AddNativeLiquidityCall) {
    this._call = call;
  }
}

export class AddTokenLiquidityCall extends ethereum.Call {
  get inputs(): AddTokenLiquidityCall__Inputs {
    return new AddTokenLiquidityCall__Inputs(this);
  }

  get outputs(): AddTokenLiquidityCall__Outputs {
    return new AddTokenLiquidityCall__Outputs(this);
  }
}

export class AddTokenLiquidityCall__Inputs {
  _call: AddTokenLiquidityCall;

  constructor(call: AddTokenLiquidityCall) {
    this._call = call;
  }

  get _token(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class AddTokenLiquidityCall__Outputs {
  _call: AddTokenLiquidityCall;

  constructor(call: AddTokenLiquidityCall) {
    this._call = call;
  }
}

export class ChangePauserCall extends ethereum.Call {
  get inputs(): ChangePauserCall__Inputs {
    return new ChangePauserCall__Inputs(this);
  }

  get outputs(): ChangePauserCall__Outputs {
    return new ChangePauserCall__Outputs(this);
  }
}

export class ChangePauserCall__Inputs {
  _call: ChangePauserCall;

  constructor(call: ChangePauserCall) {
    this._call = call;
  }

  get newPauser(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ChangePauserCall__Outputs {
  _call: ChangePauserCall;

  constructor(call: ChangePauserCall) {
    this._call = call;
  }
}

export class ClaimFeeCall extends ethereum.Call {
  get inputs(): ClaimFeeCall__Inputs {
    return new ClaimFeeCall__Inputs(this);
  }

  get outputs(): ClaimFeeCall__Outputs {
    return new ClaimFeeCall__Outputs(this);
  }
}

export class ClaimFeeCall__Inputs {
  _call: ClaimFeeCall;

  constructor(call: ClaimFeeCall) {
    this._call = call;
  }

  get _nftId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class ClaimFeeCall__Outputs {
  _call: ClaimFeeCall;

  constructor(call: ClaimFeeCall) {
    this._call = call;
  }
}

export class IncreaseNativeLiquidityCall extends ethereum.Call {
  get inputs(): IncreaseNativeLiquidityCall__Inputs {
    return new IncreaseNativeLiquidityCall__Inputs(this);
  }

  get outputs(): IncreaseNativeLiquidityCall__Outputs {
    return new IncreaseNativeLiquidityCall__Outputs(this);
  }
}

export class IncreaseNativeLiquidityCall__Inputs {
  _call: IncreaseNativeLiquidityCall;

  constructor(call: IncreaseNativeLiquidityCall) {
    this._call = call;
  }

  get _nftId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class IncreaseNativeLiquidityCall__Outputs {
  _call: IncreaseNativeLiquidityCall;

  constructor(call: IncreaseNativeLiquidityCall) {
    this._call = call;
  }
}

export class IncreaseTokenLiquidityCall extends ethereum.Call {
  get inputs(): IncreaseTokenLiquidityCall__Inputs {
    return new IncreaseTokenLiquidityCall__Inputs(this);
  }

  get outputs(): IncreaseTokenLiquidityCall__Outputs {
    return new IncreaseTokenLiquidityCall__Outputs(this);
  }
}

export class IncreaseTokenLiquidityCall__Inputs {
  _call: IncreaseTokenLiquidityCall;

  constructor(call: IncreaseTokenLiquidityCall) {
    this._call = call;
  }

  get _nftId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class IncreaseTokenLiquidityCall__Outputs {
  _call: IncreaseTokenLiquidityCall;

  constructor(call: IncreaseTokenLiquidityCall) {
    this._call = call;
  }
}

export class InitializeCall extends ethereum.Call {
  get inputs(): InitializeCall__Inputs {
    return new InitializeCall__Inputs(this);
  }

  get outputs(): InitializeCall__Outputs {
    return new InitializeCall__Outputs(this);
  }
}

export class InitializeCall__Inputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }

  get _trustedForwarder(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _lpToken(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _tokenManager(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get _pauser(): Address {
    return this._call.inputValues[3].value.toAddress();
  }
}

export class InitializeCall__Outputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }
}

export class PauseCall extends ethereum.Call {
  get inputs(): PauseCall__Inputs {
    return new PauseCall__Inputs(this);
  }

  get outputs(): PauseCall__Outputs {
    return new PauseCall__Outputs(this);
  }
}

export class PauseCall__Inputs {
  _call: PauseCall;

  constructor(call: PauseCall) {
    this._call = call;
  }
}

export class PauseCall__Outputs {
  _call: PauseCall;

  constructor(call: PauseCall) {
    this._call = call;
  }
}

export class RemoveLiquidityCall extends ethereum.Call {
  get inputs(): RemoveLiquidityCall__Inputs {
    return new RemoveLiquidityCall__Inputs(this);
  }

  get outputs(): RemoveLiquidityCall__Outputs {
    return new RemoveLiquidityCall__Outputs(this);
  }
}

export class RemoveLiquidityCall__Inputs {
  _call: RemoveLiquidityCall;

  constructor(call: RemoveLiquidityCall) {
    this._call = call;
  }

  get _nftId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class RemoveLiquidityCall__Outputs {
  _call: RemoveLiquidityCall;

  constructor(call: RemoveLiquidityCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenouncePauserCall extends ethereum.Call {
  get inputs(): RenouncePauserCall__Inputs {
    return new RenouncePauserCall__Inputs(this);
  }

  get outputs(): RenouncePauserCall__Outputs {
    return new RenouncePauserCall__Outputs(this);
  }
}

export class RenouncePauserCall__Inputs {
  _call: RenouncePauserCall;

  constructor(call: RenouncePauserCall) {
    this._call = call;
  }
}

export class RenouncePauserCall__Outputs {
  _call: RenouncePauserCall;

  constructor(call: RenouncePauserCall) {
    this._call = call;
  }
}

export class SetLiquidityPoolCall extends ethereum.Call {
  get inputs(): SetLiquidityPoolCall__Inputs {
    return new SetLiquidityPoolCall__Inputs(this);
  }

  get outputs(): SetLiquidityPoolCall__Outputs {
    return new SetLiquidityPoolCall__Outputs(this);
  }
}

export class SetLiquidityPoolCall__Inputs {
  _call: SetLiquidityPoolCall;

  constructor(call: SetLiquidityPoolCall) {
    this._call = call;
  }

  get _liquidityPool(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetLiquidityPoolCall__Outputs {
  _call: SetLiquidityPoolCall;

  constructor(call: SetLiquidityPoolCall) {
    this._call = call;
  }
}

export class SetLpTokenCall extends ethereum.Call {
  get inputs(): SetLpTokenCall__Inputs {
    return new SetLpTokenCall__Inputs(this);
  }

  get outputs(): SetLpTokenCall__Outputs {
    return new SetLpTokenCall__Outputs(this);
  }
}

export class SetLpTokenCall__Inputs {
  _call: SetLpTokenCall;

  constructor(call: SetLpTokenCall) {
    this._call = call;
  }

  get _lpToken(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetLpTokenCall__Outputs {
  _call: SetLpTokenCall;

  constructor(call: SetLpTokenCall) {
    this._call = call;
  }
}

export class SetTokenManagerCall extends ethereum.Call {
  get inputs(): SetTokenManagerCall__Inputs {
    return new SetTokenManagerCall__Inputs(this);
  }

  get outputs(): SetTokenManagerCall__Outputs {
    return new SetTokenManagerCall__Outputs(this);
  }
}

export class SetTokenManagerCall__Inputs {
  _call: SetTokenManagerCall;

  constructor(call: SetTokenManagerCall) {
    this._call = call;
  }

  get _tokenManager(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetTokenManagerCall__Outputs {
  _call: SetTokenManagerCall;

  constructor(call: SetTokenManagerCall) {
    this._call = call;
  }
}

export class SetWhiteListPeriodManagerCall extends ethereum.Call {
  get inputs(): SetWhiteListPeriodManagerCall__Inputs {
    return new SetWhiteListPeriodManagerCall__Inputs(this);
  }

  get outputs(): SetWhiteListPeriodManagerCall__Outputs {
    return new SetWhiteListPeriodManagerCall__Outputs(this);
  }
}

export class SetWhiteListPeriodManagerCall__Inputs {
  _call: SetWhiteListPeriodManagerCall;

  constructor(call: SetWhiteListPeriodManagerCall) {
    this._call = call;
  }

  get _whiteListPeriodManager(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetWhiteListPeriodManagerCall__Outputs {
  _call: SetWhiteListPeriodManagerCall;

  constructor(call: SetWhiteListPeriodManagerCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class UnpauseCall extends ethereum.Call {
  get inputs(): UnpauseCall__Inputs {
    return new UnpauseCall__Inputs(this);
  }

  get outputs(): UnpauseCall__Outputs {
    return new UnpauseCall__Outputs(this);
  }
}

export class UnpauseCall__Inputs {
  _call: UnpauseCall;

  constructor(call: UnpauseCall) {
    this._call = call;
  }
}

export class UnpauseCall__Outputs {
  _call: UnpauseCall;

  constructor(call: UnpauseCall) {
    this._call = call;
  }
}
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

export class AssetSent extends ethereum.Event {
  get params(): AssetSent__Params {
    return new AssetSent__Params(this);
  }
}

export class AssetSent__Params {
  _event: AssetSent;

  constructor(event: AssetSent) {
    this._event = event;
  }

  get asset(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get transferredAmount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get target(): Address {
    return this._event.parameters[3].value.toAddress();
  }

  get depositHash(): Bytes {
    return this._event.parameters[4].value.toBytes();
  }

  get fromChainId(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }

  get lpFee(): BigInt {
    return this._event.parameters[6].value.toBigInt();
  }

  get transferFee(): BigInt {
    return this._event.parameters[7].value.toBigInt();
  }

  get gasFee(): BigInt {
    return this._event.parameters[8].value.toBigInt();
  }
}

export class Deposit extends ethereum.Event {
  get params(): Deposit__Params {
    return new Deposit__Params(this);
  }
}

export class Deposit__Params {
  _event: Deposit;

  constructor(event: Deposit) {
    this._event = event;
  }

  get from(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get tokenAddress(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get receiver(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get toChainId(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get amount(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get reward(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }

  get tag(): string {
    return this._event.parameters[6].value.toString();
  }
}

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

  get param0(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get param1(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class GasFeeWithdraw extends ethereum.Event {
  get params(): GasFeeWithdraw__Params {
    return new GasFeeWithdraw__Params(this);
  }
}

export class GasFeeWithdraw__Params {
  _event: GasFeeWithdraw;

  constructor(event: GasFeeWithdraw) {
    this._event = event;
  }

  get tokenAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get owner(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class LiquidityProvidersChanged extends ethereum.Event {
  get params(): LiquidityProvidersChanged__Params {
    return new LiquidityProvidersChanged__Params(this);
  }
}

export class LiquidityProvidersChanged__Params {
  _event: LiquidityProvidersChanged;

  constructor(event: LiquidityProvidersChanged) {
    this._event = event;
  }

  get liquidityProvidersAddress(): Address {
    return this._event.parameters[0].value.toAddress();
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

export class Received extends ethereum.Event {
  get params(): Received__Params {
    return new Received__Params(this);
  }
}

export class Received__Params {
  _event: Received;

  constructor(event: Received) {
    this._event = event;
  }

  get from(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class TokenManagerChanged extends ethereum.Event {
  get params(): TokenManagerChanged__Params {
    return new TokenManagerChanged__Params(this);
  }
}

export class TokenManagerChanged__Params {
  _event: TokenManagerChanged;

  constructor(event: TokenManagerChanged) {
    this._event = event;
  }

  get tokenManagerAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class TrustedForwarderChanged extends ethereum.Event {
  get params(): TrustedForwarderChanged__Params {
    return new TrustedForwarderChanged__Params(this);
  }
}

export class TrustedForwarderChanged__Params {
  _event: TrustedForwarderChanged;

  constructor(event: TrustedForwarderChanged) {
    this._event = event;
  }

  get forwarderAddress(): Address {
    return this._event.parameters[0].value.toAddress();
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

export class LiquidityPool__checkHashStatusResult {
  value0: Bytes;
  value1: boolean;

  constructor(value0: Bytes, value1: boolean) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromFixedBytes(this.value0));
    map.set("value1", ethereum.Value.fromBoolean(this.value1));
    return map;
  }
}

export class LiquidityPool extends ethereum.SmartContract {
  static bind(address: Address): LiquidityPool {
    return new LiquidityPool("LiquidityPool", address);
  }

  baseGas(): BigInt {
    let result = super.call("baseGas", "baseGas():(uint256)", []);

    return result[0].toBigInt();
  }

  try_baseGas(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("baseGas", "baseGas():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  checkHashStatus(
    tokenAddress: Address,
    amount: BigInt,
    receiver: Address,
    depositHash: Bytes
  ): LiquidityPool__checkHashStatusResult {
    let result = super.call(
      "checkHashStatus",
      "checkHashStatus(address,uint256,address,bytes):(bytes32,bool)",
      [
        ethereum.Value.fromAddress(tokenAddress),
        ethereum.Value.fromUnsignedBigInt(amount),
        ethereum.Value.fromAddress(receiver),
        ethereum.Value.fromBytes(depositHash)
      ]
    );

    return new LiquidityPool__checkHashStatusResult(
      result[0].toBytes(),
      result[1].toBoolean()
    );
  }

  try_checkHashStatus(
    tokenAddress: Address,
    amount: BigInt,
    receiver: Address,
    depositHash: Bytes
  ): ethereum.CallResult<LiquidityPool__checkHashStatusResult> {
    let result = super.tryCall(
      "checkHashStatus",
      "checkHashStatus(address,uint256,address,bytes):(bytes32,bool)",
      [
        ethereum.Value.fromAddress(tokenAddress),
        ethereum.Value.fromUnsignedBigInt(amount),
        ethereum.Value.fromAddress(receiver),
        ethereum.Value.fromBytes(depositHash)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new LiquidityPool__checkHashStatusResult(
        value[0].toBytes(),
        value[1].toBoolean()
      )
    );
  }

  gasFeeAccumulated(param0: Address, param1: Address): BigInt {
    let result = super.call(
      "gasFeeAccumulated",
      "gasFeeAccumulated(address,address):(uint256)",
      [ethereum.Value.fromAddress(param0), ethereum.Value.fromAddress(param1)]
    );

    return result[0].toBigInt();
  }

  try_gasFeeAccumulated(
    param0: Address,
    param1: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "gasFeeAccumulated",
      "gasFeeAccumulated(address,address):(uint256)",
      [ethereum.Value.fromAddress(param0), ethereum.Value.fromAddress(param1)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  gasFeeAccumulatedByToken(param0: Address): BigInt {
    let result = super.call(
      "gasFeeAccumulatedByToken",
      "gasFeeAccumulatedByToken(address):(uint256)",
      [ethereum.Value.fromAddress(param0)]
    );

    return result[0].toBigInt();
  }

  try_gasFeeAccumulatedByToken(param0: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "gasFeeAccumulatedByToken",
      "gasFeeAccumulatedByToken(address):(uint256)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getCurrentLiquidity(tokenAddress: Address): BigInt {
    let result = super.call(
      "getCurrentLiquidity",
      "getCurrentLiquidity(address):(uint256)",
      [ethereum.Value.fromAddress(tokenAddress)]
    );

    return result[0].toBigInt();
  }

  try_getCurrentLiquidity(tokenAddress: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getCurrentLiquidity",
      "getCurrentLiquidity(address):(uint256)",
      [ethereum.Value.fromAddress(tokenAddress)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getExecutorManager(): Address {
    let result = super.call(
      "getExecutorManager",
      "getExecutorManager():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_getExecutorManager(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getExecutorManager",
      "getExecutorManager():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getRewardAmount(amount: BigInt, tokenAddress: Address): BigInt {
    let result = super.call(
      "getRewardAmount",
      "getRewardAmount(uint256,address):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(amount),
        ethereum.Value.fromAddress(tokenAddress)
      ]
    );

    return result[0].toBigInt();
  }

  try_getRewardAmount(
    amount: BigInt,
    tokenAddress: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getRewardAmount",
      "getRewardAmount(uint256,address):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(amount),
        ethereum.Value.fromAddress(tokenAddress)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getTransferFee(tokenAddress: Address, amount: BigInt): BigInt {
    let result = super.call(
      "getTransferFee",
      "getTransferFee(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(tokenAddress),
        ethereum.Value.fromUnsignedBigInt(amount)
      ]
    );

    return result[0].toBigInt();
  }

  try_getTransferFee(
    tokenAddress: Address,
    amount: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getTransferFee",
      "getTransferFee(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(tokenAddress),
        ethereum.Value.fromUnsignedBigInt(amount)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  incentivePool(param0: Address): BigInt {
    let result = super.call(
      "incentivePool",
      "incentivePool(address):(uint256)",
      [ethereum.Value.fromAddress(param0)]
    );

    return result[0].toBigInt();
  }

  try_incentivePool(param0: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "incentivePool",
      "incentivePool(address):(uint256)",
      [ethereum.Value.fromAddress(param0)]
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

  liquidityProviders(): Address {
    let result = super.call(
      "liquidityProviders",
      "liquidityProviders():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_liquidityProviders(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "liquidityProviders",
      "liquidityProviders():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
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

  processedHash(param0: Bytes): boolean {
    let result = super.call("processedHash", "processedHash(bytes32):(bool)", [
      ethereum.Value.fromFixedBytes(param0)
    ]);

    return result[0].toBoolean();
  }

  try_processedHash(param0: Bytes): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "processedHash",
      "processedHash(bytes32):(bool)",
      [ethereum.Value.fromFixedBytes(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  tokenManager(): Address {
    let result = super.call("tokenManager", "tokenManager():(address)", []);

    return result[0].toAddress();
  }

  try_tokenManager(): ethereum.CallResult<Address> {
    let result = super.tryCall("tokenManager", "tokenManager():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
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

export class DepositErc20Call extends ethereum.Call {
  get inputs(): DepositErc20Call__Inputs {
    return new DepositErc20Call__Inputs(this);
  }

  get outputs(): DepositErc20Call__Outputs {
    return new DepositErc20Call__Outputs(this);
  }
}

export class DepositErc20Call__Inputs {
  _call: DepositErc20Call;

  constructor(call: DepositErc20Call) {
    this._call = call;
  }

  get toChainId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get tokenAddress(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get receiver(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get tag(): string {
    return this._call.inputValues[4].value.toString();
  }
}

export class DepositErc20Call__Outputs {
  _call: DepositErc20Call;

  constructor(call: DepositErc20Call) {
    this._call = call;
  }
}

export class DepositNativeCall extends ethereum.Call {
  get inputs(): DepositNativeCall__Inputs {
    return new DepositNativeCall__Inputs(this);
  }

  get outputs(): DepositNativeCall__Outputs {
    return new DepositNativeCall__Outputs(this);
  }
}

export class DepositNativeCall__Inputs {
  _call: DepositNativeCall;

  constructor(call: DepositNativeCall) {
    this._call = call;
  }

  get receiver(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get toChainId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get tag(): string {
    return this._call.inputValues[2].value.toString();
  }
}

export class DepositNativeCall__Outputs {
  _call: DepositNativeCall;

  constructor(call: DepositNativeCall) {
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

  get _executorManagerAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _pauser(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _trustedForwarder(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get _tokenManager(): Address {
    return this._call.inputValues[3].value.toAddress();
  }

  get _liquidityProviders(): Address {
    return this._call.inputValues[4].value.toAddress();
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

export class PermitAndDepositErc20Call extends ethereum.Call {
  get inputs(): PermitAndDepositErc20Call__Inputs {
    return new PermitAndDepositErc20Call__Inputs(this);
  }

  get outputs(): PermitAndDepositErc20Call__Outputs {
    return new PermitAndDepositErc20Call__Outputs(this);
  }
}

export class PermitAndDepositErc20Call__Inputs {
  _call: PermitAndDepositErc20Call;

  constructor(call: PermitAndDepositErc20Call) {
    this._call = call;
  }

  get tokenAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get receiver(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get toChainId(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get permitOptions(): PermitAndDepositErc20CallPermitOptionsStruct {
    return changetype<PermitAndDepositErc20CallPermitOptionsStruct>(
      this._call.inputValues[4].value.toTuple()
    );
  }

  get tag(): string {
    return this._call.inputValues[5].value.toString();
  }
}

export class PermitAndDepositErc20Call__Outputs {
  _call: PermitAndDepositErc20Call;

  constructor(call: PermitAndDepositErc20Call) {
    this._call = call;
  }
}

export class PermitAndDepositErc20CallPermitOptionsStruct extends ethereum.Tuple {
  get nonce(): BigInt {
    return this[0].toBigInt();
  }

  get expiry(): BigInt {
    return this[1].toBigInt();
  }

  get allowed(): boolean {
    return this[2].toBoolean();
  }

  get v(): i32 {
    return this[3].toI32();
  }

  get r(): Bytes {
    return this[4].toBytes();
  }

  get s(): Bytes {
    return this[5].toBytes();
  }
}

export class PermitEIP2612AndDepositErc20Call extends ethereum.Call {
  get inputs(): PermitEIP2612AndDepositErc20Call__Inputs {
    return new PermitEIP2612AndDepositErc20Call__Inputs(this);
  }

  get outputs(): PermitEIP2612AndDepositErc20Call__Outputs {
    return new PermitEIP2612AndDepositErc20Call__Outputs(this);
  }
}

export class PermitEIP2612AndDepositErc20Call__Inputs {
  _call: PermitEIP2612AndDepositErc20Call;

  constructor(call: PermitEIP2612AndDepositErc20Call) {
    this._call = call;
  }

  get tokenAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get receiver(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get toChainId(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get permitOptions(): PermitEIP2612AndDepositErc20CallPermitOptionsStruct {
    return changetype<PermitEIP2612AndDepositErc20CallPermitOptionsStruct>(
      this._call.inputValues[4].value.toTuple()
    );
  }

  get tag(): string {
    return this._call.inputValues[5].value.toString();
  }
}

export class PermitEIP2612AndDepositErc20Call__Outputs {
  _call: PermitEIP2612AndDepositErc20Call;

  constructor(call: PermitEIP2612AndDepositErc20Call) {
    this._call = call;
  }
}

export class PermitEIP2612AndDepositErc20CallPermitOptionsStruct extends ethereum.Tuple {
  get nonce(): BigInt {
    return this[0].toBigInt();
  }

  get expiry(): BigInt {
    return this[1].toBigInt();
  }

  get allowed(): boolean {
    return this[2].toBoolean();
  }

  get v(): i32 {
    return this[3].toI32();
  }

  get r(): Bytes {
    return this[4].toBytes();
  }

  get s(): Bytes {
    return this[5].toBytes();
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

export class SendFundsToUserCall extends ethereum.Call {
  get inputs(): SendFundsToUserCall__Inputs {
    return new SendFundsToUserCall__Inputs(this);
  }

  get outputs(): SendFundsToUserCall__Outputs {
    return new SendFundsToUserCall__Outputs(this);
  }
}

export class SendFundsToUserCall__Inputs {
  _call: SendFundsToUserCall;

  constructor(call: SendFundsToUserCall) {
    this._call = call;
  }

  get tokenAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get receiver(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get depositHash(): Bytes {
    return this._call.inputValues[3].value.toBytes();
  }

  get tokenGasPrice(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get fromChainId(): BigInt {
    return this._call.inputValues[5].value.toBigInt();
  }
}

export class SendFundsToUserCall__Outputs {
  _call: SendFundsToUserCall;

  constructor(call: SendFundsToUserCall) {
    this._call = call;
  }
}

export class SetBaseGasCall extends ethereum.Call {
  get inputs(): SetBaseGasCall__Inputs {
    return new SetBaseGasCall__Inputs(this);
  }

  get outputs(): SetBaseGasCall__Outputs {
    return new SetBaseGasCall__Outputs(this);
  }
}

export class SetBaseGasCall__Inputs {
  _call: SetBaseGasCall;

  constructor(call: SetBaseGasCall) {
    this._call = call;
  }

  get gas(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class SetBaseGasCall__Outputs {
  _call: SetBaseGasCall;

  constructor(call: SetBaseGasCall) {
    this._call = call;
  }
}

export class SetExecutorManagerCall extends ethereum.Call {
  get inputs(): SetExecutorManagerCall__Inputs {
    return new SetExecutorManagerCall__Inputs(this);
  }

  get outputs(): SetExecutorManagerCall__Outputs {
    return new SetExecutorManagerCall__Outputs(this);
  }
}

export class SetExecutorManagerCall__Inputs {
  _call: SetExecutorManagerCall;

  constructor(call: SetExecutorManagerCall) {
    this._call = call;
  }

  get _executorManagerAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetExecutorManagerCall__Outputs {
  _call: SetExecutorManagerCall;

  constructor(call: SetExecutorManagerCall) {
    this._call = call;
  }
}

export class SetLiquidityProvidersCall extends ethereum.Call {
  get inputs(): SetLiquidityProvidersCall__Inputs {
    return new SetLiquidityProvidersCall__Inputs(this);
  }

  get outputs(): SetLiquidityProvidersCall__Outputs {
    return new SetLiquidityProvidersCall__Outputs(this);
  }
}

export class SetLiquidityProvidersCall__Inputs {
  _call: SetLiquidityProvidersCall;

  constructor(call: SetLiquidityProvidersCall) {
    this._call = call;
  }

  get _liquidityProviders(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetLiquidityProvidersCall__Outputs {
  _call: SetLiquidityProvidersCall;

  constructor(call: SetLiquidityProvidersCall) {
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

export class SetTrustedForwarderCall extends ethereum.Call {
  get inputs(): SetTrustedForwarderCall__Inputs {
    return new SetTrustedForwarderCall__Inputs(this);
  }

  get outputs(): SetTrustedForwarderCall__Outputs {
    return new SetTrustedForwarderCall__Outputs(this);
  }
}

export class SetTrustedForwarderCall__Inputs {
  _call: SetTrustedForwarderCall;

  constructor(call: SetTrustedForwarderCall) {
    this._call = call;
  }

  get trustedForwarder(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetTrustedForwarderCall__Outputs {
  _call: SetTrustedForwarderCall;

  constructor(call: SetTrustedForwarderCall) {
    this._call = call;
  }
}

export class TransferCall extends ethereum.Call {
  get inputs(): TransferCall__Inputs {
    return new TransferCall__Inputs(this);
  }

  get outputs(): TransferCall__Outputs {
    return new TransferCall__Outputs(this);
  }
}

export class TransferCall__Inputs {
  _call: TransferCall;

  constructor(call: TransferCall) {
    this._call = call;
  }

  get _tokenAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get receiver(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _tokenAmount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class TransferCall__Outputs {
  _call: TransferCall;

  constructor(call: TransferCall) {
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

export class WithdrawErc20GasFeeCall extends ethereum.Call {
  get inputs(): WithdrawErc20GasFeeCall__Inputs {
    return new WithdrawErc20GasFeeCall__Inputs(this);
  }

  get outputs(): WithdrawErc20GasFeeCall__Outputs {
    return new WithdrawErc20GasFeeCall__Outputs(this);
  }
}

export class WithdrawErc20GasFeeCall__Inputs {
  _call: WithdrawErc20GasFeeCall;

  constructor(call: WithdrawErc20GasFeeCall) {
    this._call = call;
  }

  get tokenAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class WithdrawErc20GasFeeCall__Outputs {
  _call: WithdrawErc20GasFeeCall;

  constructor(call: WithdrawErc20GasFeeCall) {
    this._call = call;
  }
}

export class WithdrawNativeGasFeeCall extends ethereum.Call {
  get inputs(): WithdrawNativeGasFeeCall__Inputs {
    return new WithdrawNativeGasFeeCall__Inputs(this);
  }

  get outputs(): WithdrawNativeGasFeeCall__Outputs {
    return new WithdrawNativeGasFeeCall__Outputs(this);
  }
}

export class WithdrawNativeGasFeeCall__Inputs {
  _call: WithdrawNativeGasFeeCall;

  constructor(call: WithdrawNativeGasFeeCall) {
    this._call = call;
  }
}

export class WithdrawNativeGasFeeCall__Outputs {
  _call: WithdrawNativeGasFeeCall;

  constructor(call: WithdrawNativeGasFeeCall) {
    this._call = call;
  }
}

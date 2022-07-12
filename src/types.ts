import { AbiItem } from "web3-utils";

export interface CompliedContract {
  abi: AbiItem[];
  devdoc: Doc;
  evm: Evm;
  ewasm: Ewasm;
  metadata: string;
  storageLayout: StorageLayout;
  userdoc: Doc;
}

export interface Doc {
  kind: string;
  methods: Methods;
  version: number;
}

export interface Methods {}

export interface Evm {
  assembly: string;
  bytecode: Bytecode;
  deployedBytecode: DeployedBytecode;
  gasEstimates: GasEstimates;
  legacyAssembly: LegacyAssembly;
  methodIdentifiers: MethodIdentifiers;
}

export interface Bytecode {
  functionDebugData: { [key: string]: FunctionDebugDatum };
  generatedSources: BytecodeGeneratedSource[];
  linkReferences: Methods;
  object: string;
  opcodes: string;
  sourceMap: string;
}

export interface FunctionDebugDatum {
  entryPoint: number | null;
  id: number | null;
  parameterSlots: number;
  returnSlots: number;
}

export interface BytecodeGeneratedSource {
  ast: PreClass;
  contents: string;
  id: number;
  language: string;
  name: string;
}

export interface FluffyStatement {
  nodeType: ASTNodeType;
  src: string;
  value?: ValueElement;
  variableNames?: Parameter[];
  expression?: ExpressionElement;
  variables?: Parameter[];
  body?: PostClass;
  condition?: Ion;
  post?: PostClass;
  pre?: PreClass;
  statements?: StatementStatement[];
}

export interface PurpleBody {
  nodeType: ASTNodeType;
  src: string;
  statements: FluffyStatement[];
}

export interface PurpleStatement {
  body: PurpleBody;
  name: string;
  nodeType: PurpleNodeType;
  returnVariables?: Parameter[];
  src: string;
  parameters?: Parameter[];
}

export interface PreClass {
  nodeType: ASTNodeType;
  src: string;
  statements: PurpleStatement[];
}

export interface PostClass {
  nodeType: ASTNodeType;
  src: string;
  statements: PostStatement[];
}

export enum ASTNodeType {
  YulAssignment = "YulAssignment",
  YulBlock = "YulBlock",
  YulExpressionStatement = "YulExpressionStatement",
  YulForLoop = "YulForLoop",
  YulIf = "YulIf",
  YulVariableDeclaration = "YulVariableDeclaration",
}

export interface PostStatement {
  expression?: PurpleExpression;
  nodeType: ASTNodeType;
  src: string;
  value?: ExpressionElement;
  variableNames?: Parameter[];
}

export interface PurpleExpression {
  arguments: ExpressionArgument[];
  functionName: Parameter;
  nodeType: ExpressionNodeType;
  src: string;
}

export interface ExpressionArgument {
  arguments?: ArgumentArgument[];
  functionName?: Parameter;
  nodeType: ExpressionNodeType;
  src: string;
  kind?: Kind;
  type?: string;
  value?: string;
}

export interface ArgumentArgument {
  name?: string;
  nodeType: ExpressionNodeType;
  src: string;
  arguments?: Parameter[];
  functionName?: Parameter;
}

export interface Parameter {
  name: string;
  nodeType: ParameterNodeType;
  src: string;
  type?: string;
}

export enum ParameterNodeType {
  YulIdentifier = "YulIdentifier",
  YulTypedName = "YulTypedName",
}

export enum ExpressionNodeType {
  YulFunctionCall = "YulFunctionCall",
  YulIdentifier = "YulIdentifier",
  YulLiteral = "YulLiteral",
}

export enum Kind {
  Number = "number",
}

export interface ExpressionElement {
  arguments?: ValueElement[];
  functionName?: Parameter;
  nodeType: ExpressionNodeType;
  src: string;
  name?: string;
}

export interface ValueElement {
  name?: string;
  nodeType: ExpressionNodeType;
  src: string;
  kind?: Kind;
  type?: string;
  value?: string;
  arguments?: ValueElement[];
  functionName?: Parameter;
}

export interface Ion {
  arguments: ValueElement[];
  functionName: Parameter;
  nodeType: ExpressionNodeType;
  src: string;
}

export interface StatementStatement {
  nodeType: ASTNodeType;
  src: string;
  value?: PurpleValue;
  variables?: Parameter[];
  body?: FluffyBody;
  condition?: ExpressionElement;
  variableNames?: Parameter[];
}

export interface FluffyBody {
  nodeType: ASTNodeType;
  src: string;
  statements: TentacledStatement[];
}

export interface TentacledStatement {
  expression: PurpleExpression;
  nodeType: ASTNodeType;
  src: string;
}

export interface PurpleValue {
  arguments: ExpressionElement[];
  functionName: Parameter;
  nodeType: ExpressionNodeType;
  src: string;
}

export enum PurpleNodeType {
  YulFunctionDefinition = "YulFunctionDefinition",
}

export interface DeployedBytecode {
  functionDebugData: { [key: string]: FunctionDebugDatum };
  generatedSources: DeployedBytecodeGeneratedSource[];
  immutableReferences: Methods;
  linkReferences: Methods;
  object: string;
  opcodes: string;
  sourceMap: string;
}

export interface DeployedBytecodeGeneratedSource {
  ast: PurpleAST;
  contents: string;
  id: number;
  language: string;
  name: string;
}

export interface PurpleAST {
  nodeType: ASTNodeType;
  src: string;
  statements: StickyStatement[];
}

export interface StickyStatement {
  body: TentacledBody;
  name: string;
  nodeType: PurpleNodeType;
  returnVariables?: Parameter[];
  src: string;
  parameters?: Parameter[];
}

export interface TentacledBody {
  nodeType: ASTNodeType;
  src: string;
  statements: IndigoStatement[];
}

export interface IndigoStatement {
  nodeType: ASTNodeType;
  src: string;
  value?: ValueElement;
  variableNames?: Parameter[];
  expression?: Ion;
  variables?: Parameter[];
  body?: PostClass;
  condition?: Ion;
  statements?: StatementStatement[];
  post?: PostClass;
  pre?: PostClass;
}

export interface GasEstimates {
  creation: Creation;
  external: MethodIdentifiers;
}

export interface Creation {
  codeDepositCost: string;
  executionCost: string;
  totalCost: string;
}

export interface MethodIdentifiers {
  "message()": string;
  "setMessage(string)": string;
}

export interface LegacyAssembly {
  ".code": Code[];
  ".data": Data;
}

export interface Code {
  begin: number;
  end: number;
  name: string;
  source: number;
  value?: string;
}

export interface Data {
  "0": The0;
}

export interface The0 {
  ".auxdata": string;
  ".code": Code[];
}

export interface Ewasm {
  wasm: string;
}

export interface StorageLayout {
  storage: Storage[];
  types: Types;
}

export interface Storage {
  astId: number;
  contract: string;
  label: string;
  offset: number;
  slot: string;
  type: string;
}

export interface Types {
  t_string_storage: TStringStorage;
}

export interface TStringStorage {
  encoding: string;
  label: string;
  numberOfBytes: string;
}

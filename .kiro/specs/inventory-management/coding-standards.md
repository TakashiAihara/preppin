# コード規約・開発標準

## 概要

備蓄管理アプリケーションの開発における統一されたコード規約とベストプラクティス。React Native、TypeScript、Hono RPC、DDD/Clean Architectureに対応した包括的な開発標準。

## 全般的な原則

### 1. 型安全性ファースト
- すべてのコードで型安全性を最優先
- `any`型の使用禁止（やむを得ない場合は`unknown`を使用）
- Zodスキーマによる厳密な型定義
- TypeScriptでの`any`型使用最小化

### 2. 関数型プログラミング指向
- イミュータブルなデータ構造を優先
- 副作用の最小化
- 純粋関数の推奨
- Result型（neverthrow）によるエラーハンドリング

### 3. 簡潔性の原則
- 記述量は最小限に抑制（パフォーマンス影響がない限り）
- `function`より`const`によるアロー関数を推奨
- コメントは最小限、型とシグネチャで意図を表現
- セルフドキュメンティングコードを目指す
- **ただし、if文やswitch文では必ずブロック`{}`を使用（可読性と安全性のため）**
- **関数・メソッドは25行以内に必ず収める（可読性と保守性のため）**
- **Production code内で`let`は極力使用しない（`const`優先）**
- **分割代入を積極的に活用して記述量削減**
- **関数の引数も分割代入で受け取り、扱いやすくする**
- **`then`チェーンは極力使わず、`async/await`で統一する**

### 4. テスト駆動開発（TDD）
- すべての機能にテストを必須
- テストファーストの開発アプローチ
- 単体テスト・統合テスト・E2Eテストの3層構造
- **テストファイル命名規則**:
  - `*.spec.ts` - 単体テスト（モック使用、単独機能テスト）
  - `*.test.ts` - 結合テスト（モック最小限、実際の依存関係使用）

### 5. ドキュメント自動生成原則
- **すべてのAs-Is系ドキュメントは自動生成で作成する**
- 手動でのドキュメント作成・更新は禁止
- コードと仕様の乖離を防止
- 継続的な最新状態維持

#### As-Is系ドキュメントの定義と自動生成ツール

```typescript
// ✅ 良い例: 自動生成されるAs-Is系ドキュメント

// 1. API仕様書 - OpenAPI/Swagger自動生成
/**
 * @swagger
 * /api/inventory/items:
 *   get:
 *     summary: 備蓄品一覧取得
 *     parameters:
 *       - name: organizationId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 備蓄品一覧
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InventoryItem'
 */
export const getInventoryItems = async (request: GetInventoryItemsRequest) => {
  // 実装
}

// 2. 型定義ドキュメント - TypeDoc自動生成
/**
 * 備蓄品エンティティ
 * @example
 * ```typescript
 * const item = InventoryItem.create({
 *   name: "米",
 *   quantity: 10,
 *   unit: "kg"
 * })
 * ```
 */
export class InventoryItem {
  /**
   * 備蓄品を消費する
   * @param amount - 消費量
   * @param reason - 消費理由
   * @returns 消費記録またはエラー
   */
  public consume(amount: number, reason?: string): Result<ConsumptionRecord, ConsumeError> {
    // 実装
  }
}

// 3. データベーススキーマドキュメント - Prisma自動生成
// prisma/schema.prisma からERD自動生成
model InventoryItem {
  id             String   @id @default(cuid())
  organizationId String   @map("organization_id")
  name           String
  quantity       Float
  unit           String
  expiryDate     DateTime? @map("expiry_date")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  organization Organization @relation(fields: [organizationId], references: [id])
  
  @@map("inventory_items")
}

// 4. アーキテクチャ図 - Mermaidダイアグラム自動生成
/**
 * @mermaid
 * graph TD
 *   A[React Web Admin] --> B[Hono BFF]
 *   C[React Native Mobile] --> D[Hono RPC Services]
 *   B --> D
 *   D --> E[NestJS Microservices]
 *   E --> F[PostgreSQL]
 *   E --> G[Valkey Cache]
 */

// 5. テストカバレッジレポート - Jest/Vitest自動生成
// package.json
{
  "scripts": {
    "test:coverage": "vitest run --coverage",
    "docs:coverage": "vitest run --coverage --reporter=html"
  }
}
```

#### 自動生成設定例

```yaml
# .github/workflows/docs.yml - GitHub Actions自動生成
name: Generate Documentation
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  generate-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # 1. API仕様書生成 (OpenAPI)
      - name: Generate OpenAPI Docs
        run: |
          pnpm run build:api-docs
          
      # 2. 型定義ドキュメント生成 (TypeDoc)  
      - name: Generate TypeScript Docs
        run: |
          pnpm run docs:typedoc
          
      # 3. データベース仕様書生成 (Prisma)
      - name: Generate Database Docs
        run: |
          pnpm run docs:db-schema
          
      # 4. テストカバレッジレポート生成
      - name: Generate Test Coverage
        run: |
          pnpm run test:coverage
          
      # 5. アーキテクチャ図生成 (Mermaid)
      - name: Generate Architecture Diagrams
        run: |
          pnpm run docs:mermaid

      # 6. 統合ドキュメントサイト構築 (VitePress/Docusaurus)
      - name: Build Documentation Site
        run: |
          pnpm run docs:build
          
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs/dist
```

```json
// package.json - 自動生成スクリプト設定
{
  "scripts": {
    // API仕様書自動生成
    "build:api-docs": "swagger-jsdoc -d swagger.config.js apps/**/*.ts -o docs/api/openapi.json",
    "serve:api-docs": "swagger-ui-serve docs/api/openapi.json",
    
    // 型定義ドキュメント自動生成
    "docs:typedoc": "typedoc --options typedoc.json",
    
    // データベーススキーマドキュメント自動生成
    "docs:db-schema": "prisma generate && prisma-docs generate",
    "docs:erd": "prisma-erd-generator",
    
    // テストカバレッジレポート自動生成
    "test:coverage": "vitest run --coverage --reporter=html --reporter=json-summary",
    
    // アーキテクチャ図自動生成
    "docs:mermaid": "mmdc -i docs/architecture.mmd -o docs/architecture.svg",
    
    // 統合ドキュメント構築
    "docs:build": "vitepress build docs",
    "docs:dev": "vitepress dev docs",
    
    // CI/CD用: 全ドキュメント自動生成
    "docs:generate-all": "pnpm run build:api-docs && pnpm run docs:typedoc && pnpm run docs:db-schema && pnpm run test:coverage && pnpm run docs:mermaid",
    
    // デプロイ前チェック: ドキュメント最新性確認
    "docs:verify": "node scripts/verify-docs-freshness.js"
  },
  "devDependencies": {
    "@swagger-api/swagger-ui": "^4.19.0",
    "swagger-jsdoc": "^6.2.8",
    "typedoc": "^0.25.0",
    "prisma-docs-generator": "^0.7.0",
    "prisma-erd-generator": "^1.11.2",
    "@mermaid-js/mermaid-cli": "^10.6.0",
    "vitepress": "^1.0.0"
  }
}
```

#### 禁止事項・ルール

```typescript
// ❌ 悪い例: 手動でのAs-Is系ドキュメント作成・更新

// 1. 手動API仕様書作成 (禁止)
// docs/api/manual-api-spec.md ❌
/**
 * ## POST /api/inventory/items
 * 手動で書かれたAPI仕様書
 * パラメータ:
 * - name: string (必須)
 * - quantity: number (必須)
 * ...
 */

// 2. 手動データベース仕様書作成 (禁止)  
// docs/database/manual-schema.md ❌
/**
 * ## inventory_items テーブル
 * | カラム名 | 型 | 説明 |
 * |---------|----|----- |
 * | id | string | 主キー |
 * ...
 */

// 3. 手動アーキテクチャ図作成 (禁止)
// 手動で描いたDraw.io、Figma等のアーキテクチャ図 ❌

// 4. 手動テストカバレッジレポート (禁止)
// 手動で作成したテスト結果サマリー ❌

// ✅ 正しいアプローチ: 自動生成ツールによる生成
// - OpenAPI/Swagger: APIスキーマから自動生成
// - TypeDoc: TypeScriptコードから自動生成  
// - Prisma: データベーススキーマから自動生成
// - Mermaid: コード内コメントから自動生成
// - Jest/Vitest: テスト実行結果から自動生成
```

#### 継続的ドキュメント維持

```typescript
// ✅ 良い例: ドキュメント鮮度チェック自動化
// scripts/verify-docs-freshness.js
export const verifyDocsFreshness = async () => {
  const codeLastModified = await getLastModifiedTime('src/**/*.ts')
  const docsLastGenerated = await getLastModifiedTime('docs/generated/**/*')
  
  if (codeLastModified > docsLastGenerated) {
    throw new Error(
      'Documentation is outdated. Run `pnpm docs:generate-all` to update.'
    )
  }
  
  console.log('✅ Documentation is up to date')
}

// lefthook.yml - コミット時ドキュメント鮮度チェック
pre-commit:
  commands:
    docs-freshness:
      run: pnpm docs:verify
      
pre-push:
  commands:
    regenerate-docs:
      run: pnpm docs:generate-all
```

## TypeScript コード規約

### ファイル・ディレクトリ命名規則

```typescript
// ✅ 良い例: ケバブケース必須
// ディレクトリでレイヤーが表現されている場合、ファイル名にレイヤー接尾辞は不要
src/
├── domain/
│   ├── inventory-items/
│   │   ├── inventory-item.ts          // ✅ エンティティ
│   │   ├── inventory-item-factory.ts  // ✅ ファクトリー
│   │   └── consumption-record.ts      // ✅ 値オブジェクト
│   ├── users/
│   │   ├── user.ts                    // ✅ ユーザーエンティティ
│   │   └── user-authentication.ts     // ✅ ユーザー認証ドメインサービス
│   └── organizations/
│       ├── organization.ts            // ✅ 組織エンティティ
│       └── organization-member.ts     // ✅ 組織メンバー値オブジェクト
├── application/
│   ├── use-cases/
│   │   ├── create-inventory-item.ts   // ✅ UseCase
│   │   ├── update-user-profile.ts     // ✅ UseCase
│   │   └── invite-organization-member.ts // ✅ UseCase
│   └── services/
│       ├── notification-service.ts    // ✅ アプリケーションサービス（例外的に.service.ts）
│       └── email-service.ts           // ✅ アプリケーションサービス（例外的に.service.ts）
├── infrastructure/
│   ├── database/
│   │   ├── inventory-repository.ts    // ✅ リポジトリ実装
│   │   ├── user-repository.ts         // ✅ リポジトリ実装
│   │   └── organization-repository.ts // ✅ リポジトリ実装
│   └── external-apis/
│       ├── barcode-api-client.ts      // ✅ 外部API クライアント
│       └── amazon-product-api.ts      // ✅ 外部API クライアント
└── presentation/
    ├── grpc/
    │   ├── inventory-grpc-service.ts   // ✅ gRPCサービス（例外的に.service.ts）
    │   └── user-grpc-service.ts        // ✅ gRPCサービス（例外的に.service.ts）
    └── controllers/
        ├── inventory-controller.ts     // ✅ コントローラー（例外的に.controller.ts）
        └── user-controller.ts          // ✅ コントローラー（例外的に.controller.ts）

// ❌ 悪い例: ディレクトリでレイヤーが分かるのに冗長な接尾辞
src/
├── domain/
│   ├── inventory-items/
│   │   ├── inventory-item.entity.ts    // ❌ .entity.ts は不要
│   │   └── inventory-service.domain.ts // ❌ .domain.ts は不要
│   └── users/
│       └── user.entity.ts              // ❌ .entity.ts は不要
├── application/
│   ├── use-cases/
│   │   └── create-item.usecase.ts      // ❌ .usecase.ts は不要
│   └── services/
│       └── notification.service.ts     // ❌ ここでは.tsのみでOK
└── infrastructure/
    └── database/
        └── inventory.repository.ts     // ❌ .repository.ts は不要

// ❌ 悪い例: camelCase や PascalCase
src/
├── inventoryItems/                     // ❌ camelCase は使わない
├── UserManagement/                     // ❌ PascalCase は使わない
└── organization_management/            // ❌ snake_case は使わない

// ✅ 例外: 技術的な区別が必要な場合のみ接尾辞を使用
src/
├── application/
│   └── services/
│       ├── email.service.ts            // ✅ サービス層では技術的区別として.service.ts可
│       └── sms.service.ts              // ✅ サービス層では技術的区別として.service.ts可
└── presentation/  
    ├── grpc/
    │   └── inventory.grpc.ts           // ✅ 通信プロトコル区別として.grpc.ts可
    └── rest/
        └── inventory.rest.ts           // ✅ 通信プロトコル区別として.rest.ts可
```

### 命名規約

```typescript
// ✅ 良い例: 命名規約
// 変数名: camelCase（名詞）
const inventoryItems = []
const currentUser = {}

// 関数名・メソッド名: camelCase + 動詞で始める
const calculateExpiryDate = () => {}      // ✅ calculate（動詞）
const getUserById = () => {}              // ✅ get（動詞）
const createInventoryItem = () => {}      // ✅ create（動詞）
const updateUserProfile = () => {}        // ✅ update（動詞）
const deleteOrganization = () => {}       // ✅ delete（動詞）
const validateInput = () => {}            // ✅ validate（動詞）
const processPayment = () => {}           // ✅ process（動詞）
const sendNotification = () => {}         // ✅ send（動詞）
const parseInventoryData = () => {}       // ✅ parse（動詞）
const formatDate = () => {}               // ✅ format（動詞）

// boolean変数: is, has, can, should, will などの接頭語を使用
const isAuthenticated = true
const hasPermission = false
const canEdit = true
const shouldRefresh = false
const willExpire = true
const isLoading = false
const hasExpired = true
const canDelete = false
const shouldNotify = true
const willUpdate = false

// クラス名: PascalCase
class InventoryItem {}
class UserAuthentication {}
class OrganizationMember {}

// Reactコンポーネント名: PascalCase + named export必須（default export禁止）
export const InventoryItemCard = () => {}     // ✅ PascalCase + named export
export const UserProfileForm = () => {}       // ✅ PascalCase + named export
export const OrganizationMemberList = () => {} // ✅ PascalCase + named export
export const ExpiryStatusBadge = () => {}     // ✅ PascalCase + named export
export const LoadingSpinner = () => {}        // ✅ PascalCase + named export

// 型名: PascalCase
type UserId = Opaque<string, 'UserId'>
type CreateInventoryItemRequest = {}
type ExpiryStatus = 'EXPIRED' | 'CRITICAL' | 'WARNING' | 'CAUTION' | 'SAFE'

// インターフェース: 具体的な名前、Iプレフィックス・***Interface接尾辞は禁止
type InventoryRepository = {  // ✅ 具体的な名前
  findById: (id: string) => Promise<InventoryItem | null>
  save: (item: InventoryItem) => Promise<void>
}

type UserNotificationService = {  // ✅ 具体的な名前
  sendEmail: (userId: string, message: string) => Promise<void>
  sendPush: (userId: string, notification: PushNotification) => Promise<void>
}

// ❌ 悪い例: Reactコンポーネントのdefault export使用
const inventoryItemCard = () => {} // ❌ camelCase（PascalCaseにすべき）
export default inventoryItemCard   // ❌ default export禁止

export default () => {}            // ❌ 匿名default export禁止

const InventoryItem = () => {}     // ❌ コンポーネント名が曖昧
export default InventoryItem       // ❌ default export禁止

// import時に異なる名前を使える（一貫性が保てない）
// import MyInventoryCard from './inventory-item-card'  // ❌ 異なる名前でimport可能

// ❌ 悪い例: 関数名が動詞で始まらない（名詞的な命名）
const expiryDate = () => {}        // ❌ calculateExpiryDateにすべき
const userById = () => {}          // ❌ getUserByIdにすべき
const inventoryItem = () => {}     // ❌ createInventoryItemにすべき
const userProfile = () => {}       // ❌ updateUserProfileにすべき
const organization = () => {}      // ❌ deleteOrganizationにすべき
const input = () => {}             // ❌ validateInputにすべき
const payment = () => {}           // ❌ processPaymentにすべき
const notification = () => {}      // ❌ sendNotificationにすべき
const inventoryData = () => {}     // ❌ parseInventoryDataにすべき
const date = () => {}              // ❌ formatDateにすべき

// ❌ 悪い例: boolean変数の曖昧な命名
const authenticated = true         // ❌ isAuthenticatedにすべき
const permission = false           // ❌ hasPermissionにすべき
const edit = true                  // ❌ canEditにすべき
const refresh = false              // ❌ shouldRefreshにすべき
const expire = true                // ❌ willExpireにすべき
const loading = false              // ❌ isLoadingにすべき
const expired = true               // ❌ hasExpiredにすべき
const visible = false              // ❌ isVisibleにすべき
const enabled = true               // ❌ isEnabledにすべき

// ❌ 悪い例: インターフェースの曖昧な命名
interface IRepository {}           // ❌ Iプレフィックス禁止
interface RepositoryInterface {}   // ❌ ***Interface接尾辞禁止
interface Repository {}            // ❌ 抽象的すぎる
```

### 型定義規約

```typescript
// ✅ 良い例: Union型でEnum代替（推奨）
export type ExpiryStatus = 'EXPIRED' | 'CRITICAL' | 'WARNING' | 'CAUTION' | 'SAFE' | 'NO_EXPIRY'
export type InventoryCategory = 'FOOD' | 'MEDICINE' | 'DAILY_NECESSITIES' | 'EMERGENCY_SUPPLIES' | 'OTHER'
export type UserRole = 'ADMIN' | 'EDITOR' | 'VIEWER'
export type ExpiryType = 'EXPIRY_DATE' | 'BEST_BEFORE_DATE' | 'NO_EXPIRY'

// ReadonlyArray for immutable arrays
export type CreateInventoryItemRequest = {
  readonly name: string
  readonly brand?: string
  readonly category: InventoryCategory
  readonly quantity: number
  readonly unit: string
  readonly minQuantity?: number
  readonly expiryDate?: Date
  readonly bestBeforeDate?: Date
  readonly expiryType: ExpiryType
  readonly storageLocation?: string
  readonly price?: Money
  readonly barcode?: string
  readonly asin?: string
  readonly tags: ReadonlyArray<string>        // ✅ ReadonlyArray for immutable data
  readonly images: ReadonlyArray<string>      // ✅ ReadonlyArray for immutable data
  readonly notes?: string
}

// type-fest活用で複雑な型定義を簡潔に
import type { Opaque, RequireAtLeastOne, PartialDeep, SetOptional } from 'type-fest'

export type UserId = Opaque<string, 'UserId'>
export type OrganizationId = Opaque<string, 'OrganizationId'>
export type InventoryItemId = Opaque<string, 'InventoryItemId'>

// 関数引数の型は必ず抽出して定義
export type CalculateExpiryStatusParams = {
  readonly expiryDate: Date
  readonly currentDate?: Date
}

export type CreateInventoryItemParams = {
  readonly organizationId: OrganizationId
  readonly userId: UserId
  readonly name: string
  readonly category: InventoryCategory
  readonly quantity: number
  readonly unit: string
  readonly expiryType: ExpiryType
  readonly tags?: ReadonlyArray<string>
}

export type UpdateInventoryItemParams = SetOptional<
  CreateInventoryItemParams,
  'organizationId' | 'userId'
> & {
  readonly id: InventoryItemId
}

// ✅ 良い例: typeを優先（interfaceより）
export type InventoryRepository = {
  findById: (id: InventoryItemId) => Promise<InventoryItem | null>
  findByOrganization: (orgId: OrganizationId) => Promise<ReadonlyArray<InventoryItem>>
  save: (item: InventoryItem) => Promise<void>
  delete: (id: InventoryItemId) => Promise<void>
}

export type UserAuthenticationService = {
  authenticate: (params: AuthenticateUserParams) => Promise<AuthenticationResult>
  refreshToken: (params: RefreshTokenParams) => Promise<TokenPair>
  revokeToken: (params: RevokeTokenParams) => Promise<void>
}

// RequireAtLeastOne for flexible parameters
export type SearchInventoryItemsParams = RequireAtLeastOne<{
  readonly name?: string
  readonly category?: InventoryCategory
  readonly barcode?: string
  readonly tags?: ReadonlyArray<string>
}, 'name' | 'category' | 'barcode' | 'tags'>

// ❌ 悪い例: Enum使用（Union型を推奨）
export enum BadExpiryStatus {  // ❌ Enumは避ける
  EXPIRED = 'EXPIRED',
  CRITICAL = 'CRITICAL',
  WARNING = 'WARNING'
}

// ❌ 悪い例: 可変配列（ReadonlyArrayを使うべき）
export type BadCreateRequest = {
  tags: string[]              // ❌ 変更予期されない配列はReadonlyArrayで
  images: Array<string>       // ❌ 変更予期されない配列はReadonlyArrayで
}

// ❌ 悪い例: interfaceの使用（typeを優先）
export interface BadRepository {  // ❌ typeを優先
  findById: (id: string) => Promise<any>
}

// ❌ 悪い例: 複雑な型定義（type-festを使うべき）
export type BadComplexType = {
  [K in keyof SomeType]: SomeType[K] extends string 
    ? SomeType[K] | null 
    : SomeType[K] extends number 
    ? SomeType[K] | undefined 
    : SomeType[K]
}  // ✅ type-festのPartialDeepやSetOptionalを使うべき

// ❌ 悪い例: 引数の型をインラインで定義
export const badFunction = (
  params: {  // ❌ 引数の型はextractして定義すべき
    name: string
    age: number
    email?: string
  }
) => {}

// ✅ 良い例: 型の組み合わせ（type-fest活用）
export type BaseInventoryItem = {
  readonly id: InventoryItemId
  readonly organizationId: OrganizationId
  readonly name: string
  readonly category: InventoryCategory
  readonly quantity: number
  readonly unit: string
  readonly createdAt: Date
  readonly updatedAt: Date
}

export type InventoryItemWithExpiry = BaseInventoryItem & {
  readonly expiryDate?: Date
  readonly bestBeforeDate?: Date
  readonly expiryType: ExpiryType
}

export type InventoryItemSummary = Pick<InventoryItemWithExpiry, 'id' | 'name' | 'quantity' | 'expiryDate'>
export type CreateInventoryItemData = Omit<BaseInventoryItem, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateInventoryItemData = PartialDeep<CreateInventoryItemData> & {
  readonly id: InventoryItemId
}
```

### 環境変数規約（Zod型安全性）

#### 1. 環境変数命名規約

- **環境変数名**: `UPPER_SNAKE_CASE` で定義
- **内部変数名**: `camelCase` で使用
- **機密情報**: 必ずマスキングして出力

#### 2. 必ず環境変数にすべき項目

- アプリケーションの動作に影響がある設定値
- 環境（開発、テスト、本番）によって値が変わる設定
- 頻繁に変更される可能性がある設定値
- 機密情報（API キー、パスワード、トークンなど）
- インフラ固有の設定（データベース URL、ポート番号など）

```typescript
// ✅ 良い例: Zodによる環境変数の型安全な取得
import { z } from 'zod'

// 環境変数スキーマ定義（UPPER_SNAKE_CASE）
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().min(1).max(65535).default(3000),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number().min(1).max(65535),
  SMTP_USER: z.string().email(),
  SMTP_PASSWORD: z.string(),
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug', 'trace']).default('info'),
  CORS_ORIGIN: z.string().or(z.array(z.string())).default('*'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000), // 15分
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
})

// 型推論でEnvironmentConfig型を自動生成
export type EnvironmentConfig = z.infer<typeof envSchema>

// 環境変数パース関数
export const parseEnvironmentVariables = (): EnvironmentConfig => {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join('\n')
      
      throw new Error(`Invalid environment configuration:\n${missingVars}`)
    }
    throw error
  }
}

// 設定オブジェクト（シングルトン）camelCaseで使用
export const config = parseEnvironmentVariables()

// 機密情報マスキング関数
const maskSecret = (value: string): string => {
  if (value.length <= 8) {
    return '*'.repeat(value.length)
  }
  return `${value.slice(0, 4)}${'*'.repeat(value.length - 8)}${value.slice(-4)}`
}

// ログ出力時は必ず機密情報をマスキング
export const logConfig = () => {
  const maskedConfig = {
    ...config,
    JWT_SECRET: maskSecret(config.JWT_SECRET),
    SMTP_PASSWORD: maskSecret(config.SMTP_PASSWORD),
    AWS_SECRET_ACCESS_KEY: config.AWS_SECRET_ACCESS_KEY 
      ? maskSecret(config.AWS_SECRET_ACCESS_KEY) 
      : undefined,
  }
  console.info('Application configuration:', maskedConfig)
}

// 使用例（camelCaseの内部変数で使用）
export const createDatabaseConnection = () => {
  const { databaseUrl, nodeEnv } = {
    databaseUrl: config.DATABASE_URL,    // ✅ 内部はcamelCase
    nodeEnv: config.NODE_ENV,
  }
  
  return createConnection({
    url: databaseUrl,                    // ✅ 型安全でバリデーション済み
    ssl: nodeEnv === 'production'
  })
}

export const createJwtService = () => {
  const { jwtSecret, jwtExpiresIn } = {
    jwtSecret: config.JWT_SECRET,        // ✅ 内部はcamelCase
    jwtExpiresIn: config.JWT_EXPIRES_IN,
  }
  
  return new JwtService({
    secret: jwtSecret,                   // ✅ 型安全、最小長チェック済み
    expiresIn: jwtExpiresIn,             // ✅ 型安全
  })
}

// アプリケーション層での使用例（camelCase変数使用）
export const createEmailService = (): EmailService => {
  const { smtpHost, smtpPort, smtpUser, smtpPassword } = {
    smtpHost: config.SMTP_HOST,          // ✅ 内部はcamelCase
    smtpPort: config.SMTP_PORT,
    smtpUser: config.SMTP_USER,
    smtpPassword: config.SMTP_PASSWORD,
  }
  
  return new SmtpEmailService({
    host: smtpHost,                      // ✅ 型安全
    port: smtpPort,                      // ✅ 型安全、数値型保証
    user: smtpUser,                      // ✅ 型安全、email形式検証済み
    password: smtpPassword,              // ✅ 型安全
  })
}

// 開発環境固有の設定（camelCase変数で使用）
const { nodeEnv } = { nodeEnv: config.NODE_ENV }
export const isDevelopment = nodeEnv === 'development'
export const isProduction = nodeEnv === 'production'
export const isTest = nodeEnv === 'test'

// ❌ 悪い例: 生の環境変数アクセス（型安全性なし）
const badDatabaseUrl = process.env.DATABASE_URL  // ❌ string | undefined、バリデーションなし
const badPort = process.env.PORT                 // ❌ string | undefined、数値変換なし
const badJwtSecret = process.env.JWT_SECRET      // ❌ undefined可能性、長さチェックなし

// ❌ 悪い例: 実行時の型変換エラーリスク
const veryBadPort = parseInt(process.env.PORT!)  // ❌ NaN可能性、型安全性なし
const veryBadCorsOrigin = JSON.parse(process.env.CORS_ORIGIN || '[]')  // ❌ 解析エラーリスク

// ❌ 悪い例: 機密情報をマスキングせずにログ出力
console.log('JWT Secret:', config.JWT_SECRET)    // ❌ 機密情報が平文でログに残る
console.log('DB Password:', process.env.DB_PASSWORD)  // ❌ 危険

// ✅ 良い例: 機密情報をマスキングして出力
console.log('JWT Secret:', maskSecret(config.JWT_SECRET))  // ✅ 安全

// ✅ 良い例: 環境別設定ファイル分割
// config/development.ts
export const developmentEnvSchema = envSchema.extend({
  DEBUG_SQL: z.coerce.boolean().default(true),
  HOT_RELOAD: z.coerce.boolean().default(true),
  API_DOCS_ENABLED: z.coerce.boolean().default(true),
})

// config/production.ts  
export const productionEnvSchema = envSchema.extend({
  HTTPS_ONLY: z.coerce.boolean().default(true),
  TRUST_PROXY: z.coerce.boolean().default(true),
  COMPRESSION_ENABLED: z.coerce.boolean().default(true),
  CLUSTER_WORKERS: z.coerce.number().min(1).default(4),
})

// config/test.ts
export const testEnvSchema = envSchema.extend({
  TEST_DATABASE_URL: z.string().url(),
  PARALLEL_TESTS: z.coerce.boolean().default(true),
  TEST_TIMEOUT: z.coerce.number().default(30000),
})

// 環境に応じたスキーマ選択
const getEnvSchema = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return developmentEnvSchema
    case 'production':
      return productionEnvSchema
    case 'test':
      return testEnvSchema
    default:
      return envSchema
  }
}

export const environmentConfig = getEnvSchema().parse(process.env)
```

### エラーハンドリング規約（neverthrow基準）

#### 1. レイヤー別エラーハンドリング戦略

- **全レイヤー**: neverthrow `Result<T, E>` 型を使用
- **コントローラーレイヤーのみ**: `Result` をキャッチし明示的に `throw` でフレームワークに伝達
- **その他レイヤー**: 例外は投げず、`Result` 型で返す

#### 2. レイヤー別実装パターン

```typescript
// ✅ 良い例: 全レイヤーでnever throw Result型使用
import { Result, ok, err } from 'neverthrow'

// ドメイン層：純粋なビジネスロジック、例外なし
export class InventoryItem {
  public consume(amount: number): Result<ConsumptionRecord, ConsumeError> {
    if (amount <= 0) {
      return err('INVALID_AMOUNT')  // ✅ 例外でなくResult
    }
    if (amount > this.quantity) {
      return err('INSUFFICIENT_QUANTITY')  // ✅ 例外でなくResult
    }
    
    const record = new ConsumptionRecord(this.id, amount, new Date())
    this.quantity -= amount
    return ok(record)  // ✅ 成功もResult
  }
}

// アプリケーション層：ユースケース、例外なし
export const createInventoryItemUseCase = async (
  request: CreateInventoryItemRequest
): Promise<Result<InventoryItem, CreateInventoryItemError>> => {
  const validationResult = validateCreateRequest(request)
  if (validationResult.isErr()) {
    return err('VALIDATION_ERROR')  // ✅ 例外でなくResult
  }

  const permissionResult = await checkPermission(request.organizationId, request.userId)
  if (permissionResult.isErr()) {
    return err('PERMISSION_DENIED')  // ✅ 例外でなくResult
  }

  const saveResult = await inventoryRepository.save(request)
  if (saveResult.isErr()) {
    return err('SAVE_FAILED')  // ✅ 例外でなくResult
  }

  return ok(saveResult.value)  // ✅ 成功もResult
}

// インフラ層：外部システム連携、例外なし
export class PrismaInventoryRepository implements InventoryRepository {
  async save(item: InventoryItem): Promise<Result<InventoryItem, SaveError>> {
    try {
      const result = await this.prisma.inventoryItem.create({
        data: this.toDto(item)
      })
      return ok(this.toDomain(result))  // ✅ 成功はResult
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        return err('DATABASE_CONSTRAINT_VIOLATION')  // ✅ エラーもResult
      }
      return err('DATABASE_CONNECTION_ERROR')  // ✅ 予期しないエラーもResult
    }
  }
}

// ✅ コントローラー層：Resultをキャッチし、明示的にthrowでフレームワークに伝達
export class InventoryController {
  async createItem(
    @Body() request: CreateInventoryItemRequest
  ): Promise<InventoryItemResponse> {
    const result = await this.createInventoryItemUseCase.execute(request)
    
    if (result.isErr()) {
      // ✅ コントローラーレイヤーでのみ明示的にError型をthrow
      switch (result.error) {
        case 'VALIDATION_ERROR':
          throw new BadRequestException('Invalid request data')
        case 'PERMISSION_DENIED':
          throw new ForbiddenException('Insufficient permissions')
        case 'ORGANIZATION_NOT_FOUND':
          throw new NotFoundException('Organization not found')
        case 'DUPLICATE_BARCODE':
          throw new ConflictException('Barcode already exists')
        default:
          throw new InternalServerErrorException('Internal server error')
      }
    }
    
    return this.toResponse(result.value)  // ✅ 成功時は正常レスポンス
  }
}

// ✅ Hono RPCコントローラー（Hono用パターン）
export const createInventoryItemHandler = async (c: Context) => {
  const request = await c.req.json<CreateInventoryItemRequest>()
  const result = await createInventoryItemUseCase.execute(request)
  
  if (result.isErr()) {
    // ✅ Honoフレームワークに適した例外パターン
    switch (result.error) {
      case 'VALIDATION_ERROR':
        return c.json({ error: 'Invalid request data' }, 400)
      case 'PERMISSION_DENIED':
        return c.json({ error: 'Insufficient permissions' }, 403)
      case 'ORGANIZATION_NOT_FOUND':
        return c.json({ error: 'Organization not found' }, 404)
      case 'DUPLICATE_BARCODE':
        return c.json({ error: 'Barcode already exists' }, 409)
      default:
        return c.json({ error: 'Internal server error' }, 500)
    }
  }
  
  return c.json(result.value, 201)
}

// ✅ 関数型チェーンパターン（neverthrowの場合のみ許可）
const validateAndCreateItem = (request: CreateInventoryItemRequest) =>
  validateCreateRequest(request)
    .andThen(validatePermissions)
    .andThen(createItemEntity)
    .andThen(saveToRepository)
    .mapErr(mapToUserFriendlyError)

// エラー型定義（Union型で定義）
export type CreateInventoryItemError = 
  | 'VALIDATION_ERROR'
  | 'PERMISSION_DENIED'
  | 'ORGANIZATION_NOT_FOUND'
  | 'DUPLICATE_BARCODE'
  | 'SAVE_FAILED'

export type ConsumeError = 
  | 'INVALID_AMOUNT'
  | 'INSUFFICIENT_QUANTITY'

export type SaveError = 
  | 'DATABASE_CONSTRAINT_VIOLATION'
  | 'DATABASE_CONNECTION_ERROR'

// ❌ 悪い例: 中間レイヤーでの例外throw
export const badCreateItem = async (request: CreateInventoryItemRequest) => {
  const item = await inventoryRepository.create(request)
  if (!item) {
    throw new Error('Failed to create item')  // ❌ アプリケーション層で例外
  }
  return item
}

// ❌ 悪い例: コントローラーでResult型を直接返す
export class BadInventoryController {
  async createItem(request: CreateInventoryItemRequest): Promise<Result<InventoryItem, string>> {
    return await this.createInventoryItemUseCase.execute(request)  // ❌ フレームワークが認識できない
  }
}

// ❌ 悪い例: try-catchの乱用
export const badErrorHandling = async (request: any) => {
  try {
    const result = await someOperation()
    try {
      const another = await anotherOperation(result)
      return another
    } catch (innerError) {
      throw new Error('Inner operation failed')  // ❌ ネストしたエラーハンドリング
    }
  } catch (outerError) {
    throw new Error('Outer operation failed')    // ❌ 意味のないエラーラップ
  }
}
```

### ログ出力規約（LOG_LEVEL基準）

#### 1. ログレベル定義と用途

| レベル | 用途 | 例 |
|--------|------|-----|
| ERROR | システムエラー、処理継続可能 | API 呼び出し失敗、個別配信エラー、データベース接続失敗 |
| WARN | 警告、注意が必要 | レート制限接近、非推奨 API 使用 |
| INFO | 一般的な情報、ビジネスイベント | 配信開始/完了、ユーザーアクション |
| DEBUG | 開発時のデバッグ情報 | 関数の入出力、内部状態 |
| TRACE | 最も詳細なトレース情報 | 詳細な実行フロー、パフォーマンス計測 |

#### 2. LOG_LEVEL環境変数制御

```typescript
// 環境変数設定
LOG_LEVEL=info  // この場合、INFO以上（INFO、WARN、ERROR）のみ出力

// ✅ 良い例: ログレベル別の適切な使い分け
import { createLogger, format, transports } from 'winston'

const logger = createLogger({
  level: config.LOG_LEVEL,  // 環境変数で制御
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json(),
    format.printf(({ timestamp, level, message, ...meta }) => {
      // 機密情報のマスキング
      const maskedMeta = maskSensitiveData(meta)
      return JSON.stringify({ timestamp, level, message, ...maskedMeta })
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'app.log' })
  ]
})

// ERROR: システムエラー、処理継続可能
export const logSystemError = (error: Error, context: Record<string, unknown>) => {
  logger.error('Database connection failed', {
    error: error.message,
    stack: error.stack,
    context: maskSensitiveData(context),
    timestamp: new Date().toISOString(),
  })
}

// WARN: 警告、注意が必要
export const logWarning = (message: string, context: Record<string, unknown>) => {
  logger.warn('Rate limit approaching 80%', {
    currentRequests: context.currentRequests,
    limit: context.limit,
    userId: context.userId,  // ユーザーIDは通常マスク不要
    ip: maskIpAddress(context.ip),  // IPアドレスはマスク
  })
}

// INFO: 一般的な情報、ビジネスイベント
export const logBusinessEvent = (event: string, context: Record<string, unknown>) => {
  logger.info('Inventory item created successfully', {
    event: 'ITEM_CREATED',
    itemId: context.itemId,
    organizationId: context.organizationId,
    userId: context.userId,
    itemName: context.itemName,
    category: context.category,
  })
}

// DEBUG: 開発時のデバッグ情報
export const logDebugInfo = (message: string, data: Record<string, unknown>) => {
  logger.debug('Function input validation', {
    functionName: 'createInventoryItem',
    input: {
      name: data.name,
      quantity: data.quantity,
      // パスワードやトークンは絶対にログ出力しない
      organizationId: data.organizationId,
    },
    validationResult: data.validationResult,
  })
}

// TRACE: 最も詳細なトレース情報
export const logTrace = (message: string, details: Record<string, unknown>) => {
  logger.debug('Database query execution', {  // winstonではtraceがないためdebugを使用
    query: details.query,
    parameters: maskSensitiveData(details.parameters),
    executionTime: details.executionTime,
    resultCount: details.resultCount,
    connectionPoolSize: details.connectionPoolSize,
  })
}

// 機密情報マスキング関数
const maskSensitiveData = (data: Record<string, unknown>): Record<string, unknown> => {
  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth', 'credential']
  const masked = { ...data }
  
  Object.keys(masked).forEach(key => {
    const lowerKey = key.toLowerCase()
    if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
      masked[key] = maskSecret(String(masked[key]))
    }
  })
  
  return masked
}

const maskIpAddress = (ip: string): string => {
  const parts = ip.split('.')
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.***.**`
  }
  return '***.***.***.**'
}

// ✅ 実際の使用例: レイヤー別ログ出力パターン

// ドメイン層でのログ出力（ビジネスロジック中心）
export class InventoryItem {
  public consume(amount: number, reason?: string): Result<ConsumptionRecord, ConsumeError> {
    // TRACE: 詳細なビジネスロジックフロー
    logger.debug('Starting item consumption', {
      itemId: this.id,
      currentQuantity: this.quantity,
      requestedAmount: amount,
      reason,
    })
    
    if (amount <= 0) {
      // WARN: ビジネスルール違反の警告
      logger.warn('Invalid consumption amount requested', {
        itemId: this.id,
        requestedAmount: amount,
        reason: 'Amount must be positive',
      })
      return err('INVALID_AMOUNT')
    }
    
    if (amount > this.quantity) {
      // WARN: 在庫不足の警告
      logger.warn('Insufficient inventory for consumption', {
        itemId: this.id,
        availableQuantity: this.quantity,
        requestedAmount: amount,
      })
      return err('INSUFFICIENT_QUANTITY')
    }
    
    const record = new ConsumptionRecord(this.id, amount, reason, new Date())
    this.quantity -= amount
    
    // INFO: 成功したビジネスイベント
    logger.info('Item consumed successfully', {
      event: 'ITEM_CONSUMED',
      itemId: this.id,
      consumedAmount: amount,
      remainingQuantity: this.quantity,
      reason,
    })
    
    return ok(record)
  }
}

// アプリケーション層でのログ出力（ユースケース中心）
export const createInventoryItemUseCase = async (
  request: CreateInventoryItemRequest
): Promise<Result<InventoryItem, CreateInventoryItemError>> => {
  // DEBUG: ユースケース開始
  logger.debug('CreateInventoryItem usecase started', {
    organizationId: request.organizationId,
    userId: request.userId,
    itemName: request.name,
  })
  
  const validationResult = validateCreateRequest(request)
  if (validationResult.isErr()) {
    // WARN: バリデーションエラー
    logger.warn('Validation failed for create inventory item', {
      errors: validationResult.error,
      request: {
        name: request.name,
        organizationId: request.organizationId,
        // 機密情報は含めない
      }
    })
    return err('VALIDATION_ERROR')
  }
  
  const saveResult = await inventoryRepository.save(request)
  if (saveResult.isErr()) {
    // ERROR: システムエラー
    logger.error('Failed to save inventory item', {
      error: saveResult.error,
      organizationId: request.organizationId,
      itemName: request.name,
    })
    return err('SAVE_FAILED')
  }
  
  // INFO: 成功したビジネスイベント
  logger.info('Inventory item created successfully', {
    event: 'ITEM_CREATED',
    itemId: saveResult.value.id,
    organizationId: request.organizationId,
    userId: request.userId,
  })
  
  return ok(saveResult.value)
}

// インフラ層でのログ出力（技術的詳細中心）
export class PrismaInventoryRepository implements InventoryRepository {
  async save(item: InventoryItem): Promise<Result<InventoryItem, SaveError>> {
    // TRACE: データベース操作の詳細
    const startTime = performance.now()
    
    try {
      logger.debug('Starting database save operation', {
        itemId: item.id,
        tableName: 'inventory_items',
        operation: 'INSERT',
      })
      
      const result = await this.prisma.inventoryItem.create({
        data: this.toDto(item)
      })
      
      const endTime = performance.now()
      
      // TRACE: パフォーマンス情報
      logger.debug('Database save completed', {
        itemId: item.id,
        executionTime: `${(endTime - startTime).toFixed(2)}ms`,
        recordId: result.id,
      })
      
      return ok(this.toDomain(result))
      
    } catch (error) {
      // ERROR: データベースエラー
      logger.error('Database save operation failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        itemId: item.id,
        operation: 'INSERT',
        tableName: 'inventory_items',
      })
      
      if (error instanceof PrismaClientKnownRequestError) {
        return err('DATABASE_CONSTRAINT_VIOLATION')
      }
      return err('DATABASE_CONNECTION_ERROR')
    }
  }
}

// コントローラー層でのログ出力（HTTP/API中心）
export const createInventoryItemHandler = async (c: Context) => {
  const requestId = crypto.randomUUID()
  const startTime = performance.now()
  
  // INFO: API リクエスト開始
  logger.info('API request received', {
    requestId,
    method: c.req.method,
    path: c.req.path,
    userAgent: c.req.header('user-agent'),
    ip: maskIpAddress(c.req.header('x-forwarded-for') || 'unknown'),
  })
  
  try {
    const request = await c.req.json<CreateInventoryItemRequest>()
    const result = await createInventoryItemUseCase.execute(request)
    
    if (result.isErr()) {
      // WARN: ビジネスエラー（4xx系）
      logger.warn('API request failed with business error', {
        requestId,
        error: result.error,
        statusCode: getStatusCodeForError(result.error),
      })
      
      return c.json({ error: getErrorMessage(result.error) }, getStatusCodeForError(result.error))
    }
    
    const endTime = performance.now()
    
    // INFO: API リクエスト成功
    logger.info('API request completed successfully', {
      requestId,
      statusCode: 201,
      responseTime: `${(endTime - startTime).toFixed(2)}ms`,
      createdItemId: result.value.id,
    })
    
    return c.json(result.value, 201)
    
  } catch (error) {
    // ERROR: システムエラー（5xx系）
    logger.error('API request failed with system error', {
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })
    
    return c.json({ error: 'Internal server error' }, 500)
  }
}

// ❌ 悪い例: 不適切なログレベル使用
logger.error('User clicked button')           // ❌ ERRORは技術的問題用
logger.info('Database connection failed')     // ❌ INFOは重大エラー用でない
logger.debug('User login successful')         // ❌ DEBUGはビジネスイベント用でない
logger.warn('Function started execution')     // ❌ WARNは正常処理用でない

// ❌ 悪い例: 機密情報の平文ログ出力
logger.info('User authenticated', {
  password: request.password,                  // ❌ 危険
  token: jwtToken,                            // ❌ 危険
  apiKey: config.API_KEY,                     // ❌ 危険
})

// ❌ 悪い例: 構造化されていないログ
logger.info(`User ${userId} created item ${itemName}`)  // ❌ 検索・分析困難
```

### 型安全性規約（型アサーション禁止）

#### 1. 型アサーション（as）の利用を極力なくす

```typescript
// ❌ 悪い例: 型アサーション（as）の使用
const data = response.data as InventoryItem          // ❌ 実行時に型が保証されない
const element = document.getElementById('form') as HTMLFormElement  // ❌ null可能性を無視
const config = process.env as EnvironmentConfig      // ❌ バリデーションなし

// ✅ 良い例: Zodバリデーションで型安全性を確保
import { z } from 'zod'

const InventoryItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  quantity: z.number().min(0),
  expiryDate: z.date().optional(),
})

export const parseInventoryItem = (data: unknown): Result<InventoryItem, ValidationError> => {
  try {
    const validatedData = InventoryItemSchema.parse(data)  // ✅ 実行時バリデーション
    return ok(validatedData)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return err(new ValidationError('Invalid inventory item data', error.errors))
    }
    return err(new ValidationError('Unknown validation error'))
  }
}

// ✅ 良い例: 型ガードで安全な型絞り込み
const isInventoryItem = (data: unknown): data is InventoryItem => {
  return InventoryItemSchema.safeParse(data).success
}

export const processApiResponse = (response: unknown) => {
  if (isInventoryItem(response)) {
    // ここではresponseがInventoryItem型として扱える
    console.log(`Processing item: ${response.name}`)
    return response
  }
  
  throw new Error('Invalid response format')
}

// ✅ 良い例: DOM要素の安全な取得
export const getFormElement = (id: string): Result<HTMLFormElement, DOMError> => {
  const element = document.getElementById(id)
  
  if (!element) {
    return err('ELEMENT_NOT_FOUND')
  }
  
  if (!(element instanceof HTMLFormElement)) {
    return err('ELEMENT_NOT_FORM')
  }
  
  return ok(element)  // ✅ 型安全にHTMLFormElementを返す
}

// ✅ 良い例: 環境変数の型安全な取得（既存パターンの再確認）
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number(),
  DATABASE_URL: z.string().url(),
})

export const getEnvironmentConfig = (): EnvironmentConfig => {
  return envSchema.parse(process.env)  // ✅ as使わずにバリデーション
}
```

#### 2. 許可される型アサーション（例外的ケース）

```typescript
// ✅ 例外的に許可: const assertions（リテラル型の保持）
export const createNotification = (userId: UserId, itemId: InventoryItemId) => {
  return {
    userId,
    type: 'ITEM_CREATED' as const,  // ✅ リテラル型保持のためのconst assertion
    data: { itemId, timestamp: new Date() }
  }
}

// ✅ 例外的に許可: タプル型の保持
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(initialValue)
  
  const updateValue = (newValue: T | ((prev: T) => T)) => {
    // 実装...
  }
  
  return [value, updateValue] as const  // ✅ タプル型保持のため
}

// ✅ 例外的に許可: unknown から既知の型への安全な変換（バリデーション後）
export const parseJsonSafely = <T>(
  json: string, 
  schema: z.ZodSchema<T>
): Result<T, ParseError> => {
  try {
    const parsed = JSON.parse(json) as unknown  // ✅ まずunknownに変換
    const validated = schema.parse(parsed)      // ✅ Zodでバリデーション
    return ok(validated)
  } catch (error) {
    return err('PARSE_ERROR')
  }
}
```

#### 3. 型アサーション回避パターン

```typescript
// ❌ 悪い例: APIレスポンスの直接アサーション
export const fetchInventoryItem = async (id: string) => {
  const response = await fetch(`/api/items/${id}`)
  const data = await response.json() as InventoryItem  // ❌ 危険
  return data
}

// ✅ 良い例: APIレスポンスの安全な処理
export const fetchInventoryItem = async (
  id: string
): Promise<Result<InventoryItem, FetchError>> => {
  try {
    const response = await fetch(`/api/items/${id}`)
    
    if (!response.ok) {
      return err('FETCH_FAILED')
    }
    
    const data = await response.json()
    const parseResult = parseInventoryItem(data)  // ✅ Zodバリデーション使用
    
    if (parseResult.isErr()) {
      return err('INVALID_RESPONSE_FORMAT')
    }
    
    return ok(parseResult.value)
  } catch (error) {
    return err('NETWORK_ERROR')
  }
}

// ❌ 悪い例: 配列要素の直接アサーション
export const processFirstItem = (items: unknown[]) => {
  const firstItem = items[0] as InventoryItem  // ❌ 危険
  return firstItem.name
}

// ✅ 良い例: 配列要素の安全な処理
export const processFirstItem = (
  items: unknown[]
): Result<string, ProcessError> => {
  if (items.length === 0) {
    return err('EMPTY_ARRAY')
  }
  
  const parseResult = parseInventoryItem(items[0])
  if (parseResult.isErr()) {
    return err('INVALID_FIRST_ITEM')
  }
  
  return ok(parseResult.value.name)
}

// ❌ 悪い例: イベント対象要素の直接アサーション
export const handleFormSubmit = (event: Event) => {
  const form = event.target as HTMLFormElement  // ❌ 危険
  const formData = new FormData(form)
}

// ✅ 良い例: イベント対象要素の安全な処理
export const handleFormSubmit = (event: Event): Result<FormData, FormError> => {
  const { target } = event
  
  if (!(target instanceof HTMLFormElement)) {
    return err('TARGET_NOT_FORM')
  }
  
  return ok(new FormData(target))  // ✅ 型安全
}

// ❌ 悪い例: オブジェクトプロパティの直接アサーション
export const extractUserInfo = (data: any) => {
  const user = data.user as User  // ❌ 危険
  return { id: user.id, name: user.name }
}

// ✅ 良い例: オブジェクトプロパティの安全な処理
const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
})

export const extractUserInfo = (
  data: unknown
): Result<{ id: string; name: string }, ExtractionError> => {
  const dataSchema = z.object({
    user: UserSchema
  })
  
  const parseResult = dataSchema.safeParse(data)
  if (!parseResult.success) {
    return err('INVALID_USER_DATA')
  }
  
  const { user } = parseResult.data
  return ok({ id: user.id, name: user.name })
}
```

#### 4. 型推論の活用

```typescript
// ✅ 良い例: TypeScriptの型推論を最大限活用
export const createInventoryService = (repository: InventoryRepository) => {
  return {
    // TypeScriptが自動的に型を推論
    async createItem(request: CreateInventoryItemRequest) {
      const validationResult = await validateRequest(request)
      if (validationResult.isErr()) {
        return validationResult  // Result<never, ValidationError>として推論
      }
      
      return await repository.save(validationResult.value)  // 型推論で安全
    },
    
    async findById(id: InventoryItemId) {
      return await repository.findById(id)  // 戻り値型が自動推論
    }
  }
}

// 型推論により、以下のように型安全に使用可能
const service = createInventoryService(prismaRepository)
// service.createItemの戻り値型は自動的にPromise<Result<InventoryItem, CreateError>>
// service.findByIdの戻り値型は自動的にPromise<InventoryItem | null>
```

### 非同期処理規約（async/await優先）

```typescript
// ✅ 良い例: async/await で統一
export const fetchInventoryItems = async ({
  organizationId,
  filters = {},
  pagination = { page: 1, limit: 20 }
}: {
  organizationId: OrganizationId
  filters?: InventoryFilters
  pagination?: Pagination
}): Promise<Result<PaginatedItems<InventoryItem>, FetchError>> => {
  try {
    // 複数の非同期処理を順次実行
    const organization = await organizationRepository.findById(organizationId)
    if (!organization) {
      return err('ORGANIZATION_NOT_FOUND')
    }

    const items = await inventoryRepository.findByFilters({
      organizationId,
      filters,
      pagination
    })

    const total = await inventoryRepository.countByFilters({
      organizationId,
      filters
    })

    return ok({ items, total, pagination })
  } catch (error) {
    logger.error('Failed to fetch inventory items', { error, organizationId })
    return err('INTERNAL_ERROR')
  }
}

// 並列処理の場合はPromise.allと組み合わせ
export const fetchInventoryWithStats = async (organizationId: OrganizationId) => {
  try {
    const [items, stats, alerts] = await Promise.all([
      inventoryRepository.findAll(organizationId),
      inventoryRepository.getStats(organizationId),
      inventoryRepository.getExpiryAlerts(organizationId)
    ])

    return ok({ items, stats, alerts })
  } catch (error) {
    return err('FETCH_FAILED')
  }
}

// ❌ 悪い例: thenチェーンの使用
export const badFetchInventoryItems = (organizationId: string) => {
  return organizationRepository.findById(organizationId)
    .then(organization => {
      if (!organization) {
        throw new Error('Organization not found')
      }
      return inventoryRepository.findByOrganization(organizationId)
    })
    .then(items => {
      return inventoryRepository.countByOrganization(organizationId)
        .then(total => ({ items, total }))
    })
    .catch(error => {
      // エラーハンドリングが複雑になる
      console.error(error)
      throw error
    })
}

// ❌ 悪い例: ネストした複雑なthenチェーン
export const veryBadExample = () => {
  return fetchUser()
    .then(user => {
      return fetchOrganization(user.organizationId)
        .then(org => {
          return fetchInventory(org.id)
            .then(items => {
              return processItems(items)
                .then(processed => {
                  // 深いネストで可読性が悪い
                  return { user, org, items: processed }
                })
            })
        })
    })
    .catch(error => {
      // どこでエラーが発生したか分からない
      throw error
    })
}
```

### 関数定義規約（25行制限 + 分割代入活用 + let最小化）

```typescript
// ✅ 良い例: 25行以内 + 分割代入 + const のみ使用
export const calculateExpiryStatus = ({
  expiryDate,
  currentDate = new Date()
}: CalculateExpiryStatusParams): ExpiryStatus => {
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (daysUntilExpiry < 0) {
    return 'EXPIRED'
  }
  if (daysUntilExpiry <= 3) {
    return 'CRITICAL'
  }
  if (daysUntilExpiry <= 7) {
    return 'WARNING'
  }
  if (daysUntilExpiry <= 30) {
    return 'CAUTION'
  }
  return 'SAFE'
} // ✅ 20行 - 25行以内でOK

// 分割代入で複数の値を返す（型安全版）
export const parseInventoryItem = (data: unknown): Result<ParsedInventoryData, ValidationError> => {
  const parseResult = RawInventoryDataSchema.safeParse(data)
  if (!parseResult.success) {
    return err(new ValidationError('Invalid data format'))
  }
  const { id, name, quantity, expiryDate } = parseResult.data
  const isValid = id && name && quantity >= 0
  
  return { 
    item: isValid ? { id, name, quantity, expiryDate } : null,
    isValid 
  }
}

// 引数の分割代入でコードを簡潔に + boolean変数の適切な命名
export const createInventoryItem = async ({
  name,
  quantity,
  unit,
  organizationId,
  expiryDate,
  ...optionalFields
}: CreateInventoryItemRequest): Promise<Result<InventoryItem, CreateError>> => {
  // letを使わず、constで値を作成 + boolean変数には適切な接頭語
  const validatedName = name.trim()
  const normalizedQuantity = Math.max(0, quantity)
  const hasExpiryDate = Boolean(expiryDate)           // ✅ has接頭語
  const isValidQuantity = normalizedQuantity > 0      // ✅ is接頭語
  const canCreateItem = validatedName && isValidQuantity  // ✅ can接頭語
  
  if (!canCreateItem) {
    return err('VALIDATION_ERROR')
  }
  
  const item = {
    name: validatedName,
    quantity: normalizedQuantity,
    unit,
    organizationId,
    expiryDate: hasExpiryDate ? expiryDate : undefined,
    ...optionalFields
  }
  
  return await inventoryRepository.create(item)
}

// 配列・オブジェクトの分割代入
export const processInventoryItems = (items: InventoryItem[]) => {
  const [first, second, ...rest] = items
  const { length } = items
  
  // map内でも分割代入
  const processed = items.map(({ id, name, quantity }) => ({
    id,
    displayName: name.toUpperCase(),
    inStock: quantity > 0
  }))
  
  return { first, second, rest, total: length, processed }
}

// ❌ 悪い例: letの多用、分割代入を使わない
export const badExample = (request: CreateRequest) => {
  let name = request.name  // letを使用
  let quantity = request.quantity
  let unit = request.unit
  
  if (name) {
    name = name.trim()  // 再代入
  }
  
  let result = null  // letを使用
  if (quantity > 0) {
    result = { name: name, quantity: quantity }  // 冗長
  }
  
  return result
}

// ❌ 悪い例: 25行を超える長大な関数
export const badCreateInventoryItem = async (request: CreateRequest) => {
  // 40行超えの長大な関数（悪い例）
  let validationErrors = []
  
  // バリデーション処理（10行）
  if (!request.name || request.name.trim().length === 0) {
    validationErrors.push('Name is required')
  }
  if (request.quantity < 0) {
    validationErrors.push('Quantity must be positive')
  }
  if (request.expiryType === 'EXPIRY' && !request.expiryDate) {
    validationErrors.push('Expiry date required for expiry type')
  }
  
  // 権限チェック処理（8行）
  const user = await getUserById(request.userId)
  if (!user) {
    throw new Error('User not found')
  }
  const organization = await getOrganizationById(request.organizationId)
  if (!organization.hasWritePermission(user.id)) {
    throw new Error('Permission denied')
  }
  
  // データベース保存処理（10行）
  const item = new InventoryItem({
    id: generateId(),
    name: request.name.trim(),
    quantity: request.quantity,
    organizationId: request.organizationId,
    createdAt: new Date(),
    updatedAt: new Date()
  })
  
  await database.save(item)
  
  // 通知処理（8行）
  const members = await getOrganizationMembers(request.organizationId)
  for (const member of members) {
    await sendNotification(member.id, {
      type: 'ITEM_CREATED',
      itemId: item.id,
      itemName: item.name
    })
  }
  
  return item
} // ❌ 45行超え - 25行制限違反

// ✅ 良い例: 25行制限を守るために関数分割
export const createInventoryItem = async ({
  organizationId,
  userId,
  ...itemData
}: CreateInventoryItemParams): Promise<Result<InventoryItem, CreateError>> => {
  const validationResult = validateItemData(itemData)
  if (validationResult.isErr()) {
    return err('VALIDATION_ERROR')
  }

  const permissionResult = await checkCreatePermission({ organizationId, userId })
  if (permissionResult.isErr()) {
    return err('PERMISSION_DENIED')
  }

  const item = createItemEntity({ organizationId, ...itemData })
  const saveResult = await saveInventoryItem(item)
  if (saveResult.isErr()) {
    return err('SAVE_FAILED')
  }

  await notifyOrganizationMembers({ organizationId, item })
  return ok(item)
} // ✅ 18行 - 25行以内でOK

// 分割された小さな関数群（それぞれ25行以内）
const validateItemData = (data: CreateItemData): Result<void, ValidationError> => {
  if (!data.name?.trim()) {
    return err(new ValidationError('Name is required'))
  }
  if (data.quantity < 0) {
    return err(new ValidationError('Quantity must be positive'))
  }
  if (data.expiryType === 'EXPIRY' && !data.expiryDate) {
    return err(new ValidationError('Expiry date required'))
  }
  return ok(undefined)
} // ✅ 11行

const checkCreatePermission = async ({
  organizationId,
  userId
}: CheckPermissionParams): Promise<Result<void, PermissionError>> => {
  const user = await userRepository.findById(userId)
  if (!user) {
    return err(new PermissionError('User not found'))
  }
  
  const organization = await organizationRepository.findById(organizationId)
  if (!organization?.hasWritePermission(userId)) {
    return err(new PermissionError('Permission denied'))
  }
  
  return ok(undefined)
} // ✅ 13行

const createItemEntity = (data: CreateItemEntityData): InventoryItem => {
  return new InventoryItem({
    id: InventoryItemId.generate(),
    organizationId: data.organizationId,
    name: data.name.trim(),
    quantity: data.quantity,
    unit: data.unit,
    expiryType: data.expiryType,
    expiryDate: data.expiryDate,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
} // ✅ 12行

const saveInventoryItem = async (
  item: InventoryItem
): Promise<Result<void, SaveError>> => {
  try {
    await inventoryRepository.save(item)
    return ok(undefined)
  } catch (error) {
    logger.error('Failed to save inventory item', { error, itemId: item.id })
    return err(new SaveError('Database save failed'))
  }
} // ✅ 8行

const notifyOrganizationMembers = async ({
  organizationId,
  item
}: NotifyMembersParams): Promise<void> => {
  const members = await organizationRepository.getMembers(organizationId)
  const notifications = members.map(member => ({
    userId: member.id,
    type: 'ITEM_CREATED' as const,
    data: { itemId: item.id, itemName: item.name }
  }))
  
  await notificationService.sendBatch(notifications)
} // ✅ 9行

// ✅ 良い例: DDD エンティティ
export class InventoryItem {
  private constructor(
    private readonly _id: InventoryItemId,
    private readonly _organizationId: OrganizationId,
    private _name: string,
    private _quantity: number,
    private readonly _unit: string,
    private _expiryDate?: Date,
    private _bestBeforeDate?: Date,
    private readonly _expiryType: ExpiryType,
    private readonly _createdAt: Date,
    private _updatedAt: Date
  ) {}

  public static create(props: CreateInventoryItemProps): Result<InventoryItem, ValidationError> {
    // バリデーション
    if (props.name.trim().length === 0) {
      return err(new ValidationError('Name cannot be empty'));
    }
    if (props.quantity < 0) {
      return err(new ValidationError('Quantity cannot be negative'));
    }

    return ok(new InventoryItem(
      props.id,
      props.organizationId,
      props.name.trim(),
      props.quantity,
      props.unit,
      props.expiryDate,
      props.bestBeforeDate,
      props.expiryType,
      new Date(),
      new Date()
    ));
  }

  // ゲッター（読み取り専用）
  public get id(): InventoryItemId { return this._id; }
  public get name(): string { return this._name; }
  public get quantity(): number { return this._quantity; }

  // ビジネスロジック
  public consume(amount: number): Result<void, ConsumeError> {
    if (amount <= 0) {
      return err(new ConsumeError('Amount must be positive'));
    }
    if (amount > this._quantity) {
      return err(new ConsumeError('Insufficient quantity'));
    }

    this._quantity -= amount;
    this._updatedAt = new Date();
    return ok(undefined);
  }

  public getExpiryStatus(currentDate: Date = new Date()): ExpiryStatus {
    return calculateExpiryStatus(this._expiryDate || this._bestBeforeDate!, currentDate);
  }
}
```

### インポート規約

```typescript
// ✅ 良い例: インポート順序
// 1. Node.js標準ライブラリ
import { readFile } from 'fs/promises';
import { join } from 'path';

// 2. 外部ライブラリ
import { z } from 'zod';
import { Result, ok, err } from 'neverthrow';
import { Injectable } from '@nestjs/common';

// 3. 内部パッケージ（@repo/）
import { InventoryItem } from '@repo/shared-types';
import { ValidationError } from '@repo/error-handling';

// 4. 相対インポート（近い順）
import { InventoryRepository } from '../repositories/inventory.repository';
import { OrganizationService } from '../services/organization.service';
import './inventory-item.entity';

// ❌ 悪い例: 順序がバラバラ
import { InventoryRepository } from '../repositories/inventory.repository';
import { z } from 'zod';
import { readFile } from 'fs/promises';
import { InventoryItem } from '@repo/shared-types';
```

## React コンポーネント規約

### Reactコンポーネント命名・エクスポート規約

```typescript
// ✅ 良い例: PascalCase + named export
export const InventoryItemCard = ({ item }: InventoryItemCardProps) => {
  return (
    <div className="inventory-item-card">
      <h3>{item.name}</h3>
      <p>数量: {item.quantity} {item.unit}</p>
    </div>
  )
}

export const UserProfileForm = ({ user, onSubmit }: UserProfileFormProps) => {
  const handleSubmit = (data: UserProfileData) => {
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* フォーム要素 */}
    </form>
  )
}

export const ExpiryStatusBadge = ({ status }: ExpiryStatusBadgeProps) => {
  const getBadgeColor = (status: ExpiryStatus) => {
    switch (status) {
      case 'EXPIRED': return 'bg-red-500'
      case 'CRITICAL': return 'bg-orange-500'
      case 'WARNING': return 'bg-yellow-500'
      default: return 'bg-green-500'
    }
  }

  return (
    <span className={`badge ${getBadgeColor(status)}`}>
      {status}
    </span>
  )
}

// ✅ 良い例: import時も同じ名前を強制
import { InventoryItemCard, UserProfileForm, ExpiryStatusBadge } from './components'

// ❌ 悪い例: default export使用
const inventoryItemCard = ({ item }) => {  // ❌ camelCase
  return <div>{item.name}</div>
}
export default inventoryItemCard          // ❌ default export

export default ({ item }) => {            // ❌ 匿名default export
  return <div>{item.name}</div>
}

const InventoryCard = ({ item }) => {     // ❌ 名前が曖昧
  return <div>{item.name}</div>
}
export default InventoryCard              // ❌ default export

// ❌ 悪い例: import時に異なる名前が使える（一貫性がない）
import MyCard from './inventory-item-card'      // ❌ 異なる名前でimport可能
import ItemCard from './inventory-item-card'    // ❌ 異なる名前でimport可能
import Whatever from './inventory-item-card'    // ❌ 全く違う名前も可能
```

### Reactコンポーネント型定義規約

```typescript
// ✅ 良い例: コンポーネントpropsの型定義
export type InventoryItemCardProps = {
  readonly item: InventoryItem
  readonly onEdit?: (item: InventoryItem) => void
  readonly onDelete?: (id: InventoryItemId) => void
  readonly className?: string
  readonly isSelected?: boolean
}

export type UserProfileFormProps = {
  readonly user: User
  readonly onSubmit: (data: UserProfileData) => Promise<void>
  readonly isLoading?: boolean
  readonly validationErrors?: ReadonlyArray<ValidationError>
}

export type ExpiryStatusBadgeProps = {
  readonly status: ExpiryStatus
  readonly size?: 'sm' | 'md' | 'lg'
  readonly variant?: 'solid' | 'outline'
}

// ✅ 良い例: コンポーネントで使用する内部型
type InventoryItemCardState = {
  readonly isExpanded: boolean
  readonly isHovered: boolean
}

type FormValidationState = {
  readonly isValid: boolean
  readonly errors: ReadonlyArray<string>
  readonly touchedFields: ReadonlySet<string>
}

// ❌ 悪い例: 型定義なし・any使用
export const BadComponent = ({ item, onEdit, onDelete }: any) => {  // ❌ any型
  return <div>{item.name}</div>
}

export const AnotherBadComponent = ({ item, onEdit, onDelete }) => {  // ❌ 型定義なし
  return <div>{item.name}</div>
}
```

### Reactコンポーネント実装規約

```typescript
// ✅ 良い例: 完全なReactコンポーネント実装
export const InventoryItemCard = ({
  item,
  onEdit,
  onDelete,
  className = '',
  isSelected = false
}: InventoryItemCardProps) => {
  // ✅ 状態管理（必要な場合）
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // ✅ イベントハンドラー（動詞で始める）
  const handleExpandToggle = useCallback(() => {
    setIsExpanded(prev => !prev)
  }, [])

  const handleEditClick = useCallback(() => {
    onEdit?.(item)
  }, [item, onEdit])

  const handleDeleteClick = useCallback(() => {
    onDelete?.(item.id)
  }, [item.id, onDelete])

  // ✅ 計算値（メモ化）
  const expiryStatus = useMemo(() => {
    return calculateExpiryStatus({
      expiryDate: item.expiryDate,
      currentDate: new Date()
    })
  }, [item.expiryDate])

  const cardClasses = useMemo(() => {
    return [
      'inventory-item-card',
      className,
      isSelected && 'selected',
      isHovered && 'hovered',
      expiryStatus === 'EXPIRED' && 'expired'
    ].filter(Boolean).join(' ')
  }, [className, isSelected, isHovered, expiryStatus])

  return (
    <div
      className={cardClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-header">
        <h3 className="item-name">{item.name}</h3>
        <ExpiryStatusBadge status={expiryStatus} />
      </div>
      
      <div className="card-body">
        <p className="quantity">
          数量: {item.quantity} {item.unit}
        </p>
        
        {isExpanded && (
          <div className="expanded-details">
            {item.brand && <p>ブランド: {item.brand}</p>}
            {item.storageLocation && <p>保管場所: {item.storageLocation}</p>}
            {item.notes && <p>メモ: {item.notes}</p>}
          </div>
        )}
      </div>
      
      <div className="card-actions">
        <button 
          type="button"
          onClick={handleExpandToggle}
          className="expand-button"
        >
          {isExpanded ? '折りたたむ' : '詳細を見る'}
        </button>
        
        {onEdit && (
          <button
            type="button"
            onClick={handleEditClick}
            className="edit-button"
          >
            編集
          </button>
        )}
        
        {onDelete && (
          <button
            type="button"
            onClick={handleDeleteClick}
            className="delete-button"
          >
            削除
          </button>
        )}
      </div>
    </div>
  )
}
```

### React Custom Hook規約

```typescript
// ✅ 良い例: useプレフィックス + camelCase
export const useInventoryItems = (organizationId: OrganizationId) => {
  const [items, setItems] = useState<ReadonlyArray<InventoryItem>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchItems = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await inventoryApi.getItems({ organizationId })
      if (response.isOk()) {
        setItems(response.value)
      } else {
        setError(new Error(response.error))
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }, [organizationId])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  return { items, isLoading, error, refetch: fetchItems }
}

export const useExpiryStatus = (item: InventoryItem) => {
  return useMemo(() => {
    return calculateExpiryStatus({
      expiryDate: item.expiryDate,
      currentDate: new Date()
    })
  }, [item.expiryDate])
}

export const useFormValidation = <T>(
  initialValues: T,
  validationSchema: z.ZodSchema<T>
) => {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

  const validateField = useCallback((fieldName: string, value: unknown) => {
    try {
      validationSchema.pick({ [fieldName]: true }).parse({ [fieldName]: value })
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: error.errors[0]?.message || 'Invalid value'
        }))
      }
    }
  }, [validationSchema])

  const updateField = useCallback((fieldName: string, value: unknown) => {
    setValues(prev => ({ ...prev, [fieldName]: value }))
    setTouchedFields(prev => new Set(prev).add(fieldName))
    validateField(fieldName, value)
  }, [validateField])

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0
  }, [errors])

  return {
    values,
    errors,
    touchedFields,
    isValid,
    updateField,
    setValues,
    reset: () => {
      setValues(initialValues)
      setErrors({})
      setTouchedFields(new Set())
    }
  }
}

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const setStoredValue = useCallback((newValue: T | ((prevValue: T) => T)) => {
    setValue(prev => {
      const valueToStore = typeof newValue === 'function' 
        ? (newValue as (prevValue: T) => T)(prev)  // ✅ 例外: 関数型判定後の安全なアサーション
        : newValue

      try {
        localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.error(`Error storing value in localStorage:`, error)
      }

      return valueToStore
    })
  }, [key])

  return [value, setStoredValue] as const
}

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// ❌ 悪い例: useプレフィックスなし・PascalCase使用
export const InventoryItems = (organizationId: string) => {  // ❌ useプレフィックスなし・PascalCase
  // フック実装
}

export const getExpiryStatus = (item: InventoryItem) => {     // ❌ useプレフィックスなし
  // フック実装
}

export const FormValidation = () => {                        // ❌ useプレフィックスなし・PascalCase
  // フック実装
}

export const localStorage_hook = () => {                     // ❌ snake_case
  // フック実装
}

export const UseDebounce = () => {                          // ❌ PascalCase
  // フック実装
}
```

## React Native コード規約

### ファイル・ディレクトリ命名規則

```typescript
// ✅ 良い例
// ファイル名: kebab-case
inventory-item.ts
user-authentication-service.ts
organization-member-entity.ts

// Reactコンポーネント: PascalCase
InventoryItemCard.tsx
UserProfileForm.tsx
OrganizationMemberList.tsx

// ディレクトリ名: kebab-case
src/
├── core/
│   ├── constants/
│   ├── errors/
│   └── network/
├── data/
│   ├── datasources/
│   ├── models/
│   └── repositories/
├── domain/
│   ├── entities/
│   ├── repositories/
│   └── usecases/
└── presentation/
    ├── screens/
    ├── components/
    ├── navigation/
    ├── hooks/
    └── store/
```

### クラス・関数定義規約

```dart
// ✅ 良い例: Clean Architecture エンティティ
class InventoryItem extends Equatable {
  const InventoryItem({
    required this.id,
    required this.organizationId,
    required this.name,
    required this.quantity,
    required this.unit,
    required this.expiryType,
    required this.createdAt,
    required this.updatedAt,
    this.brand,
    this.category = InventoryCategory.other,
    this.minQuantity,
    this.expiryDate,
    this.bestBeforeDate,
    this.storageLocation,
    this.price,
    this.barcode,
    this.asin,
    this.tags = const [],
    this.images = const [],
    this.notes,
  });

  final String id;
  final String organizationId;
  final String name;
  final String? brand;
  final InventoryCategory category;
  final double quantity;
  final String unit;
  final double? minQuantity;
  final DateTime? expiryDate;
  final DateTime? bestBeforeDate;
  final ExpiryType expiryType;
  final String? storageLocation;
  final Money? price;
  final String? barcode;
  final String? asin;
  final List<String> tags;
  final List<String> images;
  final String? notes;
  final DateTime createdAt;
  final DateTime updatedAt;

  // ビジネスロジック
  ExpiryStatus getExpiryStatus([DateTime? currentDate]) {
    final now = currentDate ?? DateTime.now();
    final targetDate = expiryDate ?? bestBeforeDate;
    
    if (targetDate == null) return ExpiryStatus.noExpiry;
    
    final daysUntilExpiry = targetDate.difference(now).inDays;
    
    if (daysUntilExpiry < 0) return ExpiryStatus.expired;
    if (daysUntilExpiry <= 3) return ExpiryStatus.critical;
    if (daysUntilExpiry <= 7) return ExpiryStatus.warning;
    if (daysUntilExpiry <= 30) return ExpiryStatus.caution;
    return ExpiryStatus.safe;
  }

  bool get isLowStock => minQuantity != null && quantity <= minQuantity!;

  // Copyメソッド
  InventoryItem copyWith({
    String? id,
    String? organizationId,
    String? name,
    String? brand,
    InventoryCategory? category,
    double? quantity,
    String? unit,
    double? minQuantity,
    DateTime? expiryDate,
    DateTime? bestBeforeDate,
    ExpiryType? expiryType,
    String? storageLocation,
    Money? price,
    String? barcode,
    String? asin,
    List<String>? tags,
    List<String>? images,
    String? notes,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return InventoryItem(
      id: id ?? this.id,
      organizationId: organizationId ?? this.organizationId,
      name: name ?? this.name,
      brand: brand ?? this.brand,
      category: category ?? this.category,
      quantity: quantity ?? this.quantity,
      unit: unit ?? this.unit,
      minQuantity: minQuantity ?? this.minQuantity,
      expiryDate: expiryDate ?? this.expiryDate,
      bestBeforeDate: bestBeforeDate ?? this.bestBeforeDate,
      expiryType: expiryType ?? this.expiryType,
      storageLocation: storageLocation ?? this.storageLocation,
      price: price ?? this.price,
      barcode: barcode ?? this.barcode,
      asin: asin ?? this.asin,
      tags: tags ?? this.tags,
      images: images ?? this.images,
      notes: notes ?? this.notes,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
## Hono RPC 規約

### Zodスキーマ定義規約

```typescript
// ✅ 良い例: 明確な命名とコメント
import { z } from 'zod';

// 備蓄品エンティティスキーマ
// 備蓄品の完全な情報を表現
export const InventoryItemSchema = z.object({
  id: z.string().describe('備蓄品ID'),
  organizationId: z.string().describe('組織ID'),
  name: z.string().min(1).max(100).describe('商品名'),
  brand: z.string().optional().describe('ブランド名（オプション）'),
  category: InventoryCategorySchema.describe('カテゴリ'),
  quantity: z.number().min(0).describe('数量'),
  unit: z.string().min(1).describe('単位'),
  minQuantity: z.number().min(0).optional().describe('最小在庫数（オプション）'),
  expiryDate: z.date().optional().describe('消費期限（オプション）'),
  bestBeforeDate: z.date().optional().describe('賞味期限（オプション）'),
  expiryType: ExpiryTypeSchema.describe('期限タイプ'),
  storageLocation: z.string().optional().describe('保管場所（オプション）'),
  price: MoneySchema.optional().describe('価格（オプション）'),
  barcode: z.string().optional().describe('バーコード（オプション）'),
  asin: z.string().optional().describe('ASIN（オプション）'),
  tags: z.array(z.string()).default([]).describe('タグ'),
  images: z.array(z.string()).default([]).describe('画像URL'),
  notes: z.string().optional().describe('メモ（オプション）'),
  createdBy: z.string().describe('作成者ID'),
  updatedBy: z.string().describe('更新者ID'),
  createdAt: z.date().describe('作成日時'),
  updatedAt: z.date().describe('更新日時'),
});

// 備蓄品作成リクエストスキーマ
export const CreateItemRequestSchema = z.object({
  organizationId: z.string().describe('組織ID（必須）'),
  name: z.string().min(1).max(100).describe('商品名（必須）'),
  brand: z.string().optional().describe('ブランド名'),
  category: InventoryCategorySchema.describe('カテゴリ（必須）'),
  quantity: z.number().min(0).describe('数量（必須）'),
  unit: z.string().min(1).describe('単位（必須）'),
  minQuantity: z.number().min(0).optional().describe('最小在庫数'),
  expiryDate: z.date().optional().describe('消費期限'),
  bestBeforeDate: z.date().optional().describe('賞味期限'),
  expiryType: ExpiryTypeSchema.describe('期限タイプ（必須）'),
  storageLocation: z.string().optional().describe('保管場所'),
  price: MoneySchema.optional().describe('価格'),
  barcode: z.string().optional().describe('バーコード'),
  asin: z.string().optional().describe('ASIN'),
  tags: z.array(z.string()).default([]).describe('タグ'),
  notes: z.string().optional().describe('メモ'),
});

// カスタムバリデーション例
export const CreateItemRequestWithValidationSchema = CreateItemRequestSchema
  .refine(
    (data) => {
      // 消費期限タイプの場合は消費期限が必須
      if (data.expiryType === 'EXPIRY' && !data.expiryDate) {
        return false;
      }
      // 賞味期限タイプの場合は賞味期限が必須
      if (data.expiryType === 'BEST_BEFORE' && !data.bestBeforeDate) {
        return false;
      }
      // 両方タイプの場合は両方必須
      if (data.expiryType === 'BOTH' && (!data.expiryDate || !data.bestBeforeDate)) {
        return false;
      }
      return true;
    },
    {
      message: 'Expiry date is required based on expiry type',
      path: ['expiryDate'],
    }
  );

// ❌ 悪い例: 曖昧な命名とバリデーション不足
const BadItemSchema = z.object({
  id: z.string(),
  data: z.any(),
  stuff: z.array(z.string()),
});
```

### ウィジェット規約

```dart
// ✅ 良い例: 単一責任のウィジェット
class InventoryItemCard extends ConsumerWidget {
  const InventoryItemCard({
    super.key,
    required this.item,
    this.onTap,
    this.onConsume,
    this.onEdit,
  });

  final InventoryItem item;
  final VoidCallback? onTap;
  final VoidCallback? onConsume;
  final VoidCallback? onEdit;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final expiryStatus = item.getExpiryStatus();
    
    return Card(
      elevation: 2,
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(theme),
              const SizedBox(height: 8),
              _buildDetails(theme),
              const SizedBox(height: 8),
              _buildActions(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(ThemeData theme) {
    return Row(
      children: [
        Expanded(
          child: Text(
            item.name,
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ),
        ExpiryStatusBadge(status: item.getExpiryStatus()),
      ],
    );
  }

  Widget _buildDetails(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (item.brand != null)
          Text(
            item.brand!,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.onSurfaceVariant,
            ),
          ),
        Text(
          '${item.quantity} ${item.unit}',
          style: theme.textTheme.bodyLarge?.copyWith(
            fontWeight: FontWeight.w500,
          ),
        ),
        if (item.storageLocation != null)
          Text(
            '保管場所: ${item.storageLocation}',
            style: theme.textTheme.bodySmall?.copyWith(
              color: theme.colorScheme.onSurfaceVariant,
            ),
          ),
      ],
    );
  }

  Widget _buildActions() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        if (onConsume != null)
          TextButton.icon(
            onPressed: onConsume,
            icon: const Icon(Icons.remove_circle_outline),
            label: const Text('消費'),
          ),
        if (onEdit != null)
          TextButton.icon(
            onPressed: onEdit,
            icon: const Icon(Icons.edit_outlined),
            label: const Text('編集'),
          ),
      ],
    );
  }
}

// ❌ 悪い例: 責任が多すぎるウィジェット
class ComplexInventoryWidget extends StatefulWidget {
  // 複数の責任を持つウィジェット
  // - データ取得
  // - 状態管理
  // - UI表示
  // - ビジネスロジック
}
```

## gRPC・Protocol Buffers 規約

### .proto ファイル規約

```protobuf
// ✅ 良い例: 明確な命名とコメント
syntax = "proto3";

package inventory.inventory;

import "common.proto";
import "google/protobuf/timestamp.proto";

option dart_package = "inventory_grpc";

// 備蓄品管理サービス
// 備蓄品のCRUD操作、検索、消費記録を提供
service InventoryService {
  // 備蓄品一覧取得
  rpc ListItems(ListItemsRequest) returns (ListItemsResponse);
  
  // 備蓄品詳細取得
  rpc GetItem(GetItemRequest) returns (InventoryItem);
  
  // 備蓄品作成
  rpc CreateItem(CreateItemRequest) returns (InventoryItem);
  
  // 備蓄品更新
  rpc UpdateItem(UpdateItemRequest) returns (InventoryItem);
  
  // 備蓄品削除
  rpc DeleteItem(DeleteItemRequest) returns (common.Empty);
  
  // 備蓄品消費記録
  rpc ConsumeItem(ConsumeItemRequest) returns (ConsumeItemResponse);
  
  // 備蓄品検索
  rpc SearchItems(SearchItemsRequest) returns (SearchItemsResponse);
  
  // 期限切れ近商品取得
  rpc GetExpiringItems(GetExpiringItemsRequest) returns (GetExpiringItemsResponse);
}

// 備蓄品エンティティ
message InventoryItem {
  string id = 1;                                    // 備蓄品ID
  string organization_id = 2;                       // 組織ID
  string name = 3;                                  // 商品名
  string brand = 4;                                 // ブランド名（オプション）
  common.InventoryCategory category = 5;            // カテゴリ
  double quantity = 6;                              // 数量
  string unit = 7;                                  // 単位
  double min_quantity = 8;                          // 最小在庫数（オプション）
  google.protobuf.Timestamp expiry_date = 9;        // 消費期限（オプション）
  google.protobuf.Timestamp best_before_date = 10;  // 賞味期限（オプション）
  common.ExpiryType expiry_type = 11;               // 期限タイプ
  string storage_location = 12;                     // 保管場所（オプション）
  common.Money price = 13;                          // 価格（オプション）
  string barcode = 14;                              // バーコード（オプション）
  string asin = 15;                                 // ASIN（オプション）
  repeated string tags = 16;                        // タグ
  repeated string images = 17;                      // 画像URL
  string notes = 18;                                // メモ（オプション）
  string created_by = 19;                           // 作成者ID
  string updated_by = 20;                           // 更新者ID
  google.protobuf.Timestamp created_at = 21;        // 作成日時
  google.protobuf.Timestamp updated_at = 22;        // 更新日時
}

// 備蓄品作成リクエスト
message CreateItemRequest {
  string organization_id = 1;                       // 組織ID（必須）
  string name = 2;                                  // 商品名（必須）
  string brand = 3;                                 // ブランド名
  common.InventoryCategory category = 4;            // カテゴリ（必須）
  double quantity = 5;                              // 数量（必須）
  string unit = 6;                                  // 単位（必須）
  double min_quantity = 7;                          // 最小在庫数
  google.protobuf.Timestamp expiry_date = 8;        // 消費期限
  google.protobuf.Timestamp best_before_date = 9;   // 賞味期限
  common.ExpiryType expiry_type = 10;               // 期限タイプ（必須）
  string storage_location = 11;                     // 保管場所
  common.Money price = 12;                          // 価格
  string barcode = 13;                              // バーコード
  string asin = 14;                                 // ASIN
  repeated string tags = 15;                        // タグ
  string notes = 16;                                // メモ
}

// ❌ 悪い例: 曖昧な命名とコメント不足
message Item {
  string id = 1;
  string data = 2;
  repeated string stuff = 3;
}
```

### gRPC エラーハンドリング規約

```typescript
// ✅ 良い例: 簡潔なgRPCサーバー
import { status } from '@grpc/grpc-js'
import { RpcException } from '@nestjs/microservices'

@Injectable()
export class InventoryGrpcService {
  createItem = async (request: CreateItemRequest): Promise<InventoryItem> => {
    const validationResult = await this.validateCreateRequest(request)
    if (validationResult.isErr()) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Validation failed',
        details: validationResult.error,
      })
    }

    const hasPermission = await this.checkPermission(
      request.organizationId,
      context.userId,
      'write'
    )
    if (!hasPermission) {
      throw new RpcException({
        code: status.PERMISSION_DENIED,
        message: 'Insufficient permissions',
      })
    }

    const result = await this.inventoryService.createItem(request)
    return result.match(
      (item) => item,
      (error) => {
        throw new RpcException(this.mapErrorToRpcException(error))
      }
    )
  }

  private mapErrorToRpcException = (error: CreateInventoryItemError) => {
    const errorMap = {
      ORGANIZATION_NOT_FOUND: { code: status.NOT_FOUND, message: 'Organization not found' },
      DUPLICATE_BARCODE: { code: status.ALREADY_EXISTS, message: 'Barcode already exists' },
    }
    return errorMap[error] || { code: status.INTERNAL, message: 'Internal server error' }
  }
}
```

```typescript
// ✅ 良い例: React Native Hono RPCクライアント
export class InventoryRepositoryImpl implements InventoryRepository {
  @override
  Future<Either<InventoryFailure, InventoryItem>> createItem(
    CreateInventoryItemRequest request,
  ) async {
    try {
      final response = await _honoRpcClient.post<Map<String, dynamic>>(
        '/items',
        body: {
          'organizationId': request.organizationId,
          'name': request.name,
          'category': request.category.name.toUpperCase(),
          'quantity': request.quantity,
          'unit': request.unit,
          'expiryType': request.expiryType.name.toUpperCase(),
          // その他のフィールド
        },
        fromJson: (json) => json,
      );
      
      final item = InventoryItemModel.fromJson(response).toEntity();
      return Right(item);
    } on HonoRpcException catch (e) {
      return Left(_mapHonoRpcErrorToFailure(e));
    } catch (e) {
      return Left(const InventoryFailure.unexpected());
    }
  }

  InventoryFailure _mapHonoRpcErrorToFailure(HonoRpcException error) {
    switch (error.statusCode) {
      case 401:
        return const InventoryFailure.unauthenticated();
      case 403:
        return const InventoryFailure.permissionDenied();
      case 404:
        return const InventoryFailure.organizationNotFound();
      case 400:
        return InventoryFailure.validationError(error.message);
      case 409:
        return const InventoryFailure.duplicateBarcode();
      default:
        return const InventoryFailure.serverError();
    }
  }
}
```

## DDD/Clean Architecture 規約

### ディレクトリ構造

```
src/
├── domain/                     # ドメイン層
│   ├── entities/              # エンティティ
│   ├── value-objects/         # 値オブジェクト
│   ├── aggregates/            # 集約
│   ├── repositories/          # リポジトリインターフェース
│   ├── services/              # ドメインサービス
│   └── events/                # ドメインイベント
├── application/               # アプリケーション層
│   ├── use-cases/             # ユースケース
│   ├── services/              # アプリケーションサービス
│   ├── ports/                 # ポート（インターフェース）
│   └── dto/                   # データ転送オブジェクト
├── infrastructure/            # インフラ層
│   ├── database/              # データベース実装
│   ├── external-apis/         # 外部API実装
│   ├── messaging/             # メッセージング実装
│   └── repositories/          # リポジトリ実装
└── presentation/              # プレゼンテーション層
    ├── controllers/           # コントローラー
    ├── grpc/                  # gRPCサービス
    └── dto/                   # プレゼンテーション用DTO
```

### エンティティ規約

```typescript
// ✅ 良い例: DDD エンティティ
export class InventoryItem {
  private constructor(
    private readonly _id: InventoryItemId,
    private readonly _organizationId: OrganizationId,
    private _props: InventoryItemProps,
    private _createdAt: Date,
    private _updatedAt: Date
  ) {}

  // ファクトリーメソッド
  public static create(
    props: CreateInventoryItemProps,
    id?: InventoryItemId
  ): Result<InventoryItem, ValidationError[]> {
    const errors: ValidationError[] = [];

    // バリデーション
    if (props.name.trim().length === 0) {
      errors.push(new ValidationError('Name cannot be empty'));
    }
    if (props.quantity < 0) {
      errors.push(new ValidationError('Quantity cannot be negative'));
    }
    if (props.expiryType === ExpiryType.EXPIRY && !props.expiryDate) {
      errors.push(new ValidationError('Expiry date is required for expiry type'));
    }

    if (errors.length > 0) {
      return err(errors);
    }

    const itemId = id || InventoryItemId.generate();
    const now = new Date();

    return ok(new InventoryItem(
      itemId,
      props.organizationId,
      {
        name: props.name.trim(),
        brand: props.brand?.trim(),
        category: props.category,
        quantity: props.quantity,
        unit: props.unit,
        minQuantity: props.minQuantity,
        expiryDate: props.expiryDate,
        bestBeforeDate: props.bestBeforeDate,
        expiryType: props.expiryType,
        storageLocation: props.storageLocation?.trim(),
        price: props.price,
        barcode: props.barcode,
        asin: props.asin,
        tags: [...props.tags],
        images: [...props.images],
        notes: props.notes?.trim(),
      },
      now,
      now
    ));
  }

  // 再構築メソッド（永続化からの復元用）
  public static reconstitute(
    id: InventoryItemId,
    organizationId: OrganizationId,
    props: InventoryItemProps,
    createdAt: Date,
    updatedAt: Date
  ): InventoryItem {
    return new InventoryItem(id, organizationId, props, createdAt, updatedAt);
  }

  // ゲッター
  public get id(): InventoryItemId { return this._id; }
  public get organizationId(): OrganizationId { return this._organizationId; }
  public get name(): string { return this._props.name; }
  public get quantity(): number { return this._props.quantity; }

  // ✅ 良い例: メソッド名も動詞で始める
  public consume(amount: number, reason?: string): Result<ConsumptionRecord, ConsumeError> {
    if (amount <= 0) {
      return err(new ConsumeError('Amount must be positive'));
    }
    if (amount > this._props.quantity) {
      return err(new ConsumeError('Insufficient quantity'));
    }

    this._props.quantity -= amount;
    this._updatedAt = new Date();

    // ドメインイベント発行
    this.addDomainEvent(new InventoryItemConsumedEvent(
      this._id,
      this._organizationId,
      amount,
      reason,
      new Date()
    ));

    return ok(new ConsumptionRecord(
      ConsumptionRecordId.generate(),
      this._id,
      amount,
      reason,
      new Date()
    ));
  }

  public updateQuantity(newQuantity: number): Result<void, ValidationError> {  // ✅ update（動詞）
    if (newQuantity < 0) {
      return err(new ValidationError('Quantity cannot be negative'));
    }

    this._props.quantity = newQuantity;
    this._updatedAt = new Date();

    return ok(undefined);
  }

  public getExpiryStatus(currentDate: Date = new Date()): ExpiryStatus {      // ✅ get（動詞）
    const targetDate = this._props.expiryDate || this._props.bestBeforeDate;
    if (!targetDate) return ExpiryStatus.NO_EXPIRY;

    const daysUntilExpiry = Math.ceil(
      (targetDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilExpiry < 0) return ExpiryStatus.EXPIRED;
    if (daysUntilExpiry <= 3) return ExpiryStatus.CRITICAL;
    if (daysUntilExpiry <= 7) return ExpiryStatus.WARNING;
    if (daysUntilExpiry <= 30) return ExpiryStatus.CAUTION;
    return ExpiryStatus.SAFE;
  }

  public calculateDaysUntilExpiry(currentDate: Date = new Date()): number {   // ✅ calculate（動詞）
    const targetDate = this._props.expiryDate || this._props.bestBeforeDate;
    if (!targetDate) return Infinity;
    
    return Math.ceil(
      (targetDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  public markAsConsumed(amount: number, reason?: string): void {              // ✅ mark（動詞）
    this._props.quantity = Math.max(0, this._props.quantity - amount);
    this._updatedAt = new Date();
    // 消費記録をドメインイベントとして発行
    this.addDomainEvent(new ItemConsumedEvent(this.id, amount, reason));
  }

  public restockItem(amount: number): Result<void, ValidationError> {        // ✅ restock（動詞）
    if (amount <= 0) {
      return err(new ValidationError('Restock amount must be positive'));
    }

    this._props.quantity += amount;
    this._updatedAt = new Date();
    return ok(undefined);
  }

  // ✅ 良い例: boolean メソッド名も適切な接頭語
  public isLowStock(): boolean {
    return this._props.minQuantity !== undefined && 
           this._props.quantity <= this._props.minQuantity;
  }

  public hasExpired(currentDate: Date = new Date()): boolean {
    const targetDate = this._props.expiryDate || this._props.bestBeforeDate;
    return targetDate ? targetDate < currentDate : false;
  }

  public canBeConsumed(amount: number): boolean {
    return amount > 0 && amount <= this._props.quantity;
  }

  public shouldAlert(): boolean {
    const isExpiringSoon = this.getExpiryStatus() === ExpiryStatus.CRITICAL;
    const isLowOnStock = this.isLowStock();
    return isExpiringSoon || isLowOnStock;
  }

  public willExpireWithin(days: number): boolean {
    const targetDate = this._props.expiryDate || this._props.bestBeforeDate;
    if (!targetDate) return false;
    
    const daysUntilExpiry = Math.ceil(
      (targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= days && daysUntilExpiry >= 0;
  }
}
```

### ユースケース規約

```typescript
// ✅ 良い例: 分割代入を活用した簡潔なユースケース
@Injectable()
export class CreateInventoryItemUseCase {
  constructor(
    private readonly inventoryRepository: InventoryRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly eventBus: EventBus,
    private readonly logger: Logger
  ) {}

  execute = async ({
    organizationId,
    userId,
    barcode,
    ...itemData
  }: CreateInventoryItemCommand): Promise<Result<InventoryItemDto, CreateInventoryItemError>> => {
    // 組織と権限チェック
    const organization = await this.organizationRepository.findById(organizationId)
    if (!organization) {
      return err('ORGANIZATION_NOT_FOUND')
    }
    if (!organization.hasWritePermission(userId)) {
      return err('PERMISSION_DENIED')
    }

    // バーコード重複チェック
    if (barcode) {
      const existingItem = await this.inventoryRepository.findByBarcode(
        organizationId,
        barcode
      )
      if (existingItem) {
        return err('DUPLICATE_BARCODE')
      }
    }

    // アイテム作成
    const itemResult = InventoryItem.create({ 
      organizationId, 
      barcode, 
      ...itemData 
    })
    if (itemResult.isErr()) {
      return err('VALIDATION_ERROR')
    }

    // 永続化とイベント発行
    const { value: item } = itemResult
    const { id } = item
    
    await this.inventoryRepository.save(item)
    await this.eventBus.publishAll(item.getDomainEvents())

    this.logger.log(`Inventory item created: ${id}`, {
      itemId: id,
      organizationId,
      userId,
    })

    return ok(InventoryItemDto.fromEntity(item))
  }
}
```

## テスト規約

### テストファイル命名規則

```typescript
// ✅ 単体テスト: *.spec.ts
// - モックを積極的に使用
// - 単一クラス/関数の振る舞いをテスト
// - 外部依存を全てモック化
inventory-item.entity.spec.ts
create-inventory-item.usecase.spec.ts
inventory.repository.spec.ts

// ✅ 結合テスト: *.test.ts  
// - モックは最小限（外部API、データベースのみ）
// - 複数コンポーネントの連携をテスト
// - 実際の依存関係を使用
inventory-service.test.ts
inventory-grpc.test.ts
create-item-flow.test.ts
```

### 単体テスト規約（*.spec.ts - モック使用）

```typescript
// ✅ 良い例: inventory-item.entity.spec.ts - 単体テスト with モック
describe('InventoryItem', () => {
  describe('Given valid props', () => {
    const props: CreateInventoryItemProps = {
      organizationId: OrganizationId.generate(),
      name: 'Test Item',
      category: InventoryCategory.FOOD,
      quantity: 10,
      unit: '個',
      expiryType: ExpiryType.BEST_BEFORE,
      bestBeforeDate: new Date('2024-12-31'),
      tags: ['test', 'food'],
    }
    
    describe('When creating inventory item', () => {
      let result: Result<InventoryItem, ValidationError>
      
      beforeEach(() => {
        result = InventoryItem.create(props)
      })
      
      describe('Then should create item successfully', () => {
        it('returns ok result', () => {
          expect(result.isOk()).toBe(true)
        })
        
        it('has correct name', () => {
          expect(result.value.name).toBe('Test Item')
        })
        
        it('has correct quantity', () => {
          expect(result.value.quantity).toBe(10)
        })
        
        it('has correct tags', () => {
          expect(result.value.tags).toEqual(['test', 'food'])
        })
      })
    })
  })

  describe('Given empty name', () => {
    const props: CreateInventoryItemProps = {
      organizationId: OrganizationId.generate(),
      name: '',
      category: InventoryCategory.FOOD,
      quantity: 10,
      unit: '個',
      expiryType: ExpiryType.BEST_BEFORE,
      tags: [],
    }
    
    describe('When creating inventory item', () => {
      let result: Result<InventoryItem, ValidationError>
      
      beforeEach(() => {
        result = InventoryItem.create(props)
      })
      
      describe('Then should return validation error', () => {
        it('returns error result', () => {
          expect(result.isErr()).toBe(true)
        })
        
        it('contains name validation message', () => {
          expect(result.error).toContainEqual(
            expect.objectContaining({
              message: 'Name cannot be empty',
            })
          )
        })
      })
    })
  })

  describe('Given item with quantity 10', () => {
    let item: InventoryItem
    
    beforeEach(() => {
      item = createTestInventoryItem({ quantity: 10 })
    })
    
    describe('When consuming 3 items', () => {
      let result: Result<ConsumptionRecord, ConsumeError>
      
      beforeEach(() => {
        result = item.consume(3, 'Daily use')
      })
      
      describe('Then should consume successfully', () => {
        it('returns ok result', () => {
          expect(result.isOk()).toBe(true)
        })
        
        it('reduces quantity to 7', () => {
          expect(item.quantity).toBe(7)
        })
        
        it('records consumption amount', () => {
          expect(result.value.amount).toBe(3)
        })
        
        it('records consumption reason', () => {
          expect(result.value.reason).toBe('Daily use')
        })
      })
    })

    describe('When consuming more than available', () => {
      let result: Result<ConsumptionRecord, ConsumeError>
      
      beforeEach(() => {
        item = createTestInventoryItem({ quantity: 5 })
        result = item.consume(10)
      })
      
      describe('Then should return error', () => {
        it('returns error result', () => {
          expect(result.isErr()).toBe(true)
        })
        
        it('has insufficient quantity message', () => {
          expect(result.error.message).toBe('Insufficient quantity')
        })
        
        it('does not change quantity', () => {
          expect(item.quantity).toBe(5)
        })
      })
    })
  })
})

const createTestInventoryItem = (overrides: Partial<CreateInventoryItemProps> = {}): InventoryItem => {
  const defaultProps: CreateInventoryItemProps = {
    organizationId: OrganizationId.generate(),
    name: 'Test Item',
    category: InventoryCategory.FOOD,
    quantity: 10,
    unit: '個',
    expiryType: ExpiryType.BEST_BEFORE,
    tags: [],
  }

  const props = { ...defaultProps, ...overrides }
  const result = InventoryItem.create(props)
  
  if (result.isErr()) {
    throw new Error(`Failed to create test item: ${result.error}`)
  }
  
  return result.value
}
```

### 結合テスト規約（*.test.ts - モック最小限）

```typescript
// ✅ 良い例: create-inventory-item.test.ts - 結合テスト（実際の依存関係使用）
describe('CreateInventoryItem Integration', () => {
  let inventoryRepository: InventoryRepository
  let organizationRepository: OrganizationRepository
  let eventBus: EventBus
  let useCase: CreateInventoryItemUseCase
  
  beforeEach(() => {
    // 実際のリポジトリ実装を使用（インメモリDB）
    inventoryRepository = new InventoryRepositoryImpl(inMemoryDb)
    organizationRepository = new OrganizationRepositoryImpl(inMemoryDb)
    eventBus = new EventBusImpl()
    
    // UseCaseは実際の依存関係で初期化
    useCase = new CreateInventoryItemUseCase(
      inventoryRepository,
      organizationRepository,
      eventBus,
      logger
    )
  })
  
  describe('Given valid organization and user permissions', () => {
    let organization: Organization
    let command: CreateInventoryItemCommand
    
    beforeEach(async () => {
      // 実際にデータを作成
      organization = await organizationRepository.save(
        Organization.create({
          name: 'Test Org',
          ownerId: 'user-123'
        })
      )
      
      command = {
        organizationId: organization.id,
        userId: 'user-123',
        name: 'Test Item',
        category: InventoryCategory.FOOD,
        quantity: 10,
        unit: '個',
      }
    })
    
    describe('When creating inventory item', () => {
      let result: Result<InventoryItemDto, CreateInventoryItemError>
      
      beforeEach(async () => {
        result = await useCase.execute(command)
      })
      
      describe('Then should create item in repository', () => {
        it('returns ok result', () => {
          expect(result.isOk()).toBe(true)
        })
        
        it('persists item in repository', async () => {
          const savedItem = await inventoryRepository.findById(result.value.id)
          expect(savedItem).toBeDefined()
        })
        
        it('publishes domain event', () => {
          expect(eventBus.getPublishedEvents()).toHaveLength(1)
        })
        
        it('creates item with correct data', async () => {
          const savedItem = await inventoryRepository.findById(result.value.id)
          expect(savedItem.name).toBe('Test Item')
        })
      })
    })
  })
})

// ❌ 悪い例: *.test.ts なのに過度なモック使用
describe('Bad Integration Test', () => {
  let mockRepo: jest.Mock  // 結合テストでモックを使いすぎ
  let mockEventBus: jest.Mock
  
  beforeEach(() => {
    mockRepo = jest.fn()
    mockEventBus = jest.fn()
    // これは単体テスト（*.spec.ts）でやるべき
  })
})
```

### 単体テスト vs 結合テストの使い分け

```typescript
// inventory-item.entity.spec.ts - 単体テスト
describe('InventoryItem Entity Unit Test', () => {
  // エンティティのビジネスロジックのみテスト
  // 外部依存なし、モックなし
})

// inventory.repository.spec.ts - 単体テスト  
describe('InventoryRepository Unit Test', () => {
  let mockPrisma: DeepMockProxy<PrismaClient>
  
  beforeEach(() => {
    mockPrisma = mockDeep<PrismaClient>()  // Prismaをモック
  })
  
  // リポジトリのロジックのみテスト
})

// create-inventory-usecase.spec.ts - 単体テスト
describe('CreateInventoryItemUseCase Unit Test', () => {
  let mockInventoryRepo: jest.Mocked<InventoryRepository>
  let mockOrgRepo: jest.Mocked<OrganizationRepository>
  
  beforeEach(() => {
    // 全ての依存をモック化
    mockInventoryRepo = createMock<InventoryRepository>()
    mockOrgRepo = createMock<OrganizationRepository>()
  })
  
  // UseCaseのオーケストレーションロジックのみテスト
})

// inventory-service.test.ts - 結合テスト
describe('InventoryService Integration Test', () => {
  // 実際のリポジトリ、UseCase、サービスを使用
  // データベースはインメモリDBまたはテストコンテナ
  // 外部APIのみモック
})
```

### React Native テスト規約（Given-When-Then + Jest/Testing Library）

```dart
// ✅ 良い例: Given-When-Then形式 + 1つのtestWidgetsに1つのexpect (RSpec風)
void main() {
  group('InventoryItemCard', () {
    late InventoryItem testItem

    setUp(() {
      testItem = const InventoryItem(
        id: 'test-id',
        organizationId: 'org-id',
        name: 'Test Item',
        quantity: 10,
        unit: '個',
        expiryType: ExpiryType.bestBefore,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      )
    })

    group('Given inventory item with basic data', () {
      group('When widget is rendered', () {
        group('Then should display item information correctly', () {
          testWidgets('shows item name', (tester) async {
            await tester.pumpWidget(
              MaterialApp(
                home: Scaffold(
                  body: InventoryItemCard(item: testItem),
                ),
              ),
            )

            expect(find.text('Test Item'), findsOneWidget)
          })
          
          testWidgets('shows item quantity', (tester) async {
            await tester.pumpWidget(
              MaterialApp(
                home: Scaffold(
                  body: InventoryItemCard(item: testItem),
                ),
              ),
            )

            expect(find.text('10 個'), findsOneWidget)
          })
        })
      })

      group('When card is tapped', () {
        group('Then should call onTap callback', () {
          testWidgets('invokes onTap with true', (tester) async {
            bool wasTapped = false
            await tester.pumpWidget(
              MaterialApp(
                home: Scaffold(
                  body: InventoryItemCard(
                    item: testItem,
                    onTap: () => wasTapped = true,
                  ),
                ),
              ),
            )

            await tester.tap(find.byType(InventoryItemCard))
            await tester.pumpAndSettle()

            expect(wasTapped, isTrue)
          })
        })
      })
    })

    group('Given item expiring in 2 days', () {
      group('When widget is rendered', () {
        group('Then should show expiry status badge', () {
          testWidgets('displays ExpiryStatusBadge widget', (tester) async {
            final expiringItem = testItem.copyWith(
              expiryDate: DateTime.now().add(const Duration(days: 2)),
            )

            await tester.pumpWidget(
              MaterialApp(
                home: Scaffold(
                  body: InventoryItemCard(item: expiringItem),
                ),
              ),
            )

            expect(find.byType(ExpiryStatusBadge), findsOneWidget)
          })
        })
      })
    })
  })
}
```

## コミット・ブランチ規約

### コミットメッセージ規約

```bash
# ✅ 良い例: Conventional Commits
feat(inventory): add barcode scanning functionality
fix(auth): resolve token refresh issue
docs(api): update gRPC service documentation
test(inventory): add unit tests for InventoryItem entity
refactor(database): optimize inventory query performance
chore(deps): update React Native dependencies

# 詳細な例
feat(inventory): implement expiry date management

- Add support for both expiry date and best-before date
- Implement expiry status calculation logic
- Add expiry alerts for items nearing expiration
- Update UI to display appropriate expiry warnings

Closes #123

# ❌ 悪い例
fix bug
update code
add feature
```

### ブランチ命名規約

```bash
# ✅ 良い例
feature/inventory-barcode-scanning
feature/auth-token-refresh
fix/inventory-quantity-validation
fix/grpc-connection-timeout
hotfix/critical-auth-vulnerability
release/v1.2.0
chore/update-dependencies

# ❌ 悪い例
new-feature
bug-fix
temp
test-branch
```

## パフォーマンス・セキュリティ規約

### パフォーマンス規約

```typescript
// ✅ 良い例: 効率的なデータベースクエリ
export class InventoryRepository {
  async findItemsWithExpiry(
    organizationId: OrganizationId,
    days: number
  ): Promise<InventoryItem[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    // インデックスを活用した効率的なクエリ
    const items = await this.prisma.inventoryItem.findMany({
      where: {
        organizationId: organizationId.value,
        OR: [
          {
            expiryDate: {
              lte: futureDate,
            },
          },
          {
            bestBeforeDate: {
              lte: futureDate,
            },
          },
        ],
      },
      orderBy: [
        { expiryDate: 'asc' },
        { bestBeforeDate: 'asc' },
      ],
      // 必要なフィールドのみ選択
      select: {
        id: true,
        name: true,
        quantity: true,
        unit: true,
        expiryDate: true,
        bestBeforeDate: true,
        expiryType: true,
      },
    });

    return items.map(item => this.toDomain(item));
  }
}

// ❌ 悪い例: 非効率なクエリ
export class BadInventoryRepository {
  async findItemsWithExpiry(organizationId: string): Promise<any[]> {
    // 全件取得してアプリケーション側でフィルタリング（非効率）
    const allItems = await this.prisma.inventoryItem.findMany({
      where: { organizationId },
    });

    return allItems.filter(item => {
      // 複雑な計算をアプリケーション側で実行
      const daysUntilExpiry = calculateDaysUntilExpiry(item);
      return daysUntilExpiry <= 30;
    });
  }
}
```

```typescript
// ✅ 良い例: React Native パフォーマンス最適化
export const InventoryListScreen: React.FC = () => {
  const { items, isLoading, error, fetchItems } = useInventoryStore();
  const [refreshing, setRefreshing] = useState(false);
  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchItems('current-org-id');
    } finally {
      setRefreshing(false);
    }
  }, [fetchItems]);
  
  const renderItem = useCallback(({ item }: { item: InventoryItem }) => (
    <InventoryItemCard
      key={item.id}
      item={item}
      onPress={() => navigation.navigate('ItemDetail', { itemId: item.id })}
    />
  ), [navigation]);
  
  if (isLoading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => fetchItems('current-org-id')}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={styles.container}
      // パフォーマンス最適化
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={10}
      getItemLayout={(data, index) => ({
        length: 120,
        offset: 120 * index,
        index,
      })}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  retryText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

// ❌ 悪い例: パフォーマンスを考慮しない実装
export const BadInventoryListScreen: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  
  // 毎回再レンダリングで新しい関数を作成（パフォーマンス悪化）
  const renderItem = ({ item }: { item: InventoryItem }) => (
    <View>
      <Text>{item.name}</Text>
      {/* 重い処理を含むコンポーネント */}
      <ExpensiveComponent item={item} />
    </View>
  );
  
  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      // keyExtractorなし（パフォーマンス悪化）
      // 最適化設定なし
    />
  );
}
  Widget build(BuildContext context, WidgetRef ref) {
    final inventoryItems = ref.watch(inventoryItemsProvider);

    return inventoryItems.when(
      data: (items) => ListView.builder(
        // パフォーマンス最適化
        itemCount: items.length,
        itemExtent: 120, // 固定高さでスクロール性能向上
        cacheExtent: 1000, // キャッシュ範囲拡大
        itemBuilder: (context, index) {
          final item = items[index];
          return InventoryItemCard(
            key: ValueKey(item.id), // 効率的な再描画
            item: item,
            onTap: () => _navigateToDetail(context, item),
          );
        },
      ),
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, stack) => ErrorWidget(error),
    );
  }
}

// ❌ 悪い例: パフォーマンスを考慮しない実装
class BadInventoryListWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: fetchAllItems(), // 毎回再取得
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          return Column(
            children: snapshot.data!.map((item) => 
              ExpensiveWidget(item: item) // 重い処理を含むウィジェット
            ).toList(),
          );
        }
        return CircularProgressIndicator();
      },
    );
  }
}
```

### セキュリティ規約

```typescript
// ✅ 良い例: セキュアな実装
@Injectable()
export class InventoryGrpcService {
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RateLimitInterceptor)
  async createItem(
    request: CreateItemRequest,
    context: GrpcContext
  ): Promise<InventoryItem> {
    // 1. 入力値検証
    const validationResult = await this.validateInput(request);
    if (validationResult.isErr()) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Invalid input',
      });
    }

    // 2. 認証・認可チェック
    const userId = context.getUser().id;
    const hasPermission = await this.authService.checkPermission(
      userId,
      request.organizationId,
      'inventory:write'
    );
    
    if (!hasPermission) {
      // セキュリティログ記録
      this.securityLogger.warn('Unauthorized inventory access attempt', {
        userId,
        organizationId: request.organizationId,
        action: 'create_item',
        ip: context.getClientIp(),
      });
      
      throw new RpcException({
        code: status.PERMISSION_DENIED,
        message: 'Insufficient permissions',
      });
    }

    // 3. 入力値サニタイゼーション
    const sanitizedRequest = {
      ...request,
      name: this.sanitizer.sanitize(request.name),
      notes: request.notes ? this.sanitizer.sanitize(request.notes) : undefined,
    };

    // 4. ビジネスロジック実行
    const result = await this.inventoryService.createItem(sanitizedRequest);
    
    // 5. 監査ログ記録
    this.auditLogger.info('Inventory item created', {
      userId,
      organizationId: request.organizationId,
      itemId: result.id,
      timestamp: new Date().toISOString(),
    });

    return result;
  }

  private async validateInput(request: CreateItemRequest): Promise<Result<void, ValidationError[]>> {
    const schema = z.object({
      organizationId: z.string().uuid(),
      name: z.string().min(1).max(100).regex(/^[a-zA-Z0-9\s\-_]+$/), // 安全な文字のみ
      quantity: z.number().min(0).max(999999),
      unit: z.string().min(1).max(20),
      // その他のバリデーション
    });

    try {
      schema.parse(request);
      return ok(undefined);
    } catch (error) {
      return err([new ValidationError('Invalid input format')]);
    }
  }
}

// ❌ 悪い例: セキュリティを考慮しない実装
@Injectable()
export class BadInventoryService {
  async createItem(request: any): Promise<any> {
    // 入力値検証なし
    // 認証・認可チェックなし
    // SQLインジェクション脆弱性
    const query = `INSERT INTO inventory_items (name, quantity) VALUES ('${request.name}', ${request.quantity})`;
    return await this.database.query(query);
  }
}
```

### GitHub Issue ワークフロー規約（Design Doc活用）

#### 1. 基本方針

- **すべてのタスクはGitHub Issueで管理**
- **Design Docとして Issue を活用**
- **「何をどうやって対応したか、解決したか」をIssueコメントで詳細記録**

#### 2. Issue作成・管理パターン

```markdown
# Issue テンプレート例

## 📋 概要
備蓄品管理サービスの認証機能実装

## 🎯 目的・背景
- ユーザーが安全にシステムにログインできる機能が必要
- JWT トークンベースの認証システムを構築
- 組織レベルでの権限管理を実現

## 📝 要件定義
### 機能要件
- [ ] ユーザー登録機能
- [ ] ログイン・ログアウト機能  
- [ ] JWT トークン管理（15分有効期限）
- [ ] リフレッシュトークン機能（7日有効期限）
- [ ] パスワードリセット機能

### 非機能要件
- [ ] セキュリティ：パスワードハッシュ化（bcrypt）
- [ ] パフォーマンス：トークン検証 < 100ms
- [ ] 可用性：99.9%稼働率
- [ ] ログ：認証関連の監査ログ記録

## 🏗️ 技術設計
### アーキテクチャ
- Clean Architecture + DDD パターン適用
- Hono + Hono RPC による API 実装
- neverthrow Result型でエラーハンドリング

### API設計
```typescript
// POST /auth/register
type RegisterRequest = {
  email: string
  password: string  
  organizationCode?: string
}

type RegisterResponse = Result<{
  user: User
  tokens: TokenPair
}, RegisterError>
```

### データベース設計
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🧪 テスト計画
### 単体テスト（*.spec.ts）
- [ ] パスワードハッシュ化機能テスト
- [ ] JWT トークン生成・検証テスト
- [ ] バリデーション関数テスト

### 結合テスト（*.test.ts）
- [ ] 認証 API エンドポイントテスト
- [ ] データベース連携テスト
- [ ] トークンリフレッシュフローテスト

## 📈 完了基準
- [ ] すべての機能要件が実装済み
- [ ] 単体テストカバレッジ 90% 以上
- [ ] 結合テストが全て通過
- [ ] セキュリティレビュー完了
- [ ] パフォーマンステスト通過
- [ ] ドキュメント更新完了

## 📚 関連リソース
- [認証設計書](link)  
- [API仕様書](link)
- [セキュリティガイドライン](link)

---

## 📝 実装ログ（解決過程の記録）

### 2024-01-15 - 初期設計完了
**実施内容:**
- Clean Architecture の層構造設計
- Domain層: User、AuthenticationService エンティティ設計
- Application層: RegisterUserUseCase、LoginUserUseCase 設計  
- Infrastructure層: PrismaUserRepository、BcryptPasswordService 設計

**設計決定:**
- パスワードハッシュ化にbcrypt採用（コスト12）
- JWT有効期限：Access Token 15分、Refresh Token 7日
- 組織招待コードによる登録フロー採用

**課題・検討事項:**
- 組織招待コードの衝突回避方法
- パスワード強度ポリシーの具体化

### 2024-01-16 - Domain層実装完了  
**実施内容:**
```typescript
// User エンティティ実装
export class User {
  constructor(
    private readonly _id: UserId,
    private readonly _email: Email,
    private readonly _passwordHash: PasswordHash,
    private _emailVerified: boolean = false
  ) {}

  public static create(props: CreateUserProps): Result<User, UserCreationError> {
    // バリデーション + ドメインルール実装
  }
}

// 認証サービス実装  
export class AuthenticationService {
  public async authenticate(
    email: Email, 
    password: Password
  ): Promise<Result<TokenPair, AuthenticationError>> {
    // 認証ロジック実装
  }
}
```

**解決した課題:**
- PasswordHashをOpaque型で実装し、型安全性確保
- Emailドメイン検証ロジックをvalue objectで実装
- User作成時のドメインルール（重複チェック等）実装

**テスト結果:**
- Domain層単体テスト：35/35 通過 ✅
- テストカバレッジ：96%

### 2024-01-17 - Application層実装完了
**実施内容:**
```typescript
// ユーザー登録ユースケース実装
export const registerUserUseCase = async (
  request: RegisterUserRequest
): Promise<Result<RegisterUserResponse, RegisterUserError>> => {
  // 1. バリデーション
  const validationResult = validateRegisterRequest(request)
  if (validationResult.isErr()) {
    return err('VALIDATION_ERROR')
  }

  // 2. 重複チェック
  const existingUser = await userRepository.findByEmail(request.email)
  if (existingUser) {
    return err('EMAIL_ALREADY_EXISTS')
  }

  // 3. パスワードハッシュ化
  const passwordHashResult = await passwordService.hash(request.password)
  if (passwordHashResult.isErr()) {
    return err('PASSWORD_HASH_FAILED')
  }

  // 4. ユーザー作成
  const userResult = User.create({
    email: request.email,
    passwordHash: passwordHashResult.value
  })
  
  if (userResult.isErr()) {
    return err('USER_CREATION_FAILED')
  }

  // 5. 永続化
  const saveResult = await userRepository.save(userResult.value)
  if (saveResult.isErr()) {
    return err('SAVE_FAILED')
  }

  return ok({ user: userResult.value })
}
```

**解決した課題:**
- neverthrow Result型による一貫したエラーハンドリング実装
- 組織招待コード検証ロジック実装
- メール重複チェックの競合状態対策（DBレベル制約 + アプリケーションレベルチェック）

**テスト結果:**  
- Application層単体テスト：28/28 通過 ✅
- エラーケーステスト：15/15 通過 ✅

### 2024-01-18 - Infrastructure層実装完了
**実施内容:**
```typescript
// Prisma Repository実装
export class PrismaUserRepository implements UserRepository {
  async save(user: User): Promise<Result<User, SaveUserError>> {
    try {
      const userData = this.toDto(user)
      const result = await this.prisma.user.create({
        data: userData
      })
      return ok(this.toDomain(result))
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return err('EMAIL_ALREADY_EXISTS')
        }
      }
      logger.error('User save failed', { error, userId: user.id })
      return err('DATABASE_ERROR')
    }
  }
}

// Bcrypt Password Service実装
export class BcryptPasswordService implements PasswordService {
  private readonly COST = 12

  async hash(password: Password): Promise<Result<PasswordHash, HashError>> {
    try {
      const hash = await bcrypt.hash(password.value, this.COST)
      return ok(PasswordHash.create(hash))
    } catch (error) {
      logger.error('Password hashing failed', { error })
      return err('HASH_FAILED')
    }
  }
}
```

**解決した課題:**
- Prisma制約違反エラーの適切なハンドリング
- bcryptコスト最適化（性能テスト実施：12で約150ms）
- データベース接続プール設定最適化

**パフォーマンステスト結果:**
- ユーザー登録API：平均応答時間 180ms ✅（目標 < 500ms）
- ログインAPI：平均応答時間 95ms ✅（目標 < 100ms）

### 2024-01-19 - API層実装・テスト完了
**実施内容:**
```typescript
// Hono RPC ハンドラー実装
export const registerUserHandler = async (c: Context) => {
  const requestId = crypto.randomUUID()
  
  logger.info('User registration request received', {
    requestId,
    ip: maskIpAddress(c.req.header('x-forwarded-for')),
  })
  
  try {
    const request = await c.req.json<RegisterUserRequest>()
    const result = await registerUserUseCase.execute(request)
    
    if (result.isErr()) {
      logger.warn('User registration failed', {
        requestId,
        error: result.error,
        email: maskEmail(request.email),
      })
      
      switch (result.error) {
        case 'VALIDATION_ERROR':
          return c.json({ error: 'Invalid request data' }, 400)
        case 'EMAIL_ALREADY_EXISTS':
          return c.json({ error: 'Email already registered' }, 409)
        default:
          return c.json({ error: 'Registration failed' }, 500)
      }
    }
    
    logger.info('User registration successful', {
      requestId,
      userId: result.value.user.id,
      email: maskEmail(request.email),
    })
    
    return c.json(result.value, 201)
    
  } catch (error) {
    logger.error('User registration system error', {
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    
    return c.json({ error: 'Internal server error' }, 500)
  }
}
```

**解決した課題:**
- リクエストID による処理追跡可能性確保
- 機密情報（メール、IP）の適切なマスキング
- Honoフレームワークでの一貫したエラーハンドリング

**最終テスト結果:**
- 単体テスト：98/98 通過 ✅ (カバレッジ 94%)
- 結合テスト：45/45 通過 ✅
- E2Eテスト：12/12 通過 ✅
- セキュリティテスト：SQLインジェクション、XSS対策確認 ✅
- パフォーマンステスト：全API目標値クリア ✅

### 2024-01-20 - 完了・デプロイ
**実施内容:**
- Railway環境へのデプロイ
- 本番環境での疎通確認
- 監視設定（Grafana Stack）
- ドキュメント更新

**完了確認:**
- ✅ 全機能要件実装完了  
- ✅ 全非機能要件達成
- ✅ テスト完了（カバレッジ目標達成）
- ✅ セキュリティレビュー完了
- ✅ パフォーマンステスト合格
- ✅ 本番デプロイ完了

**今後の改善点:**
- OAuth2.0対応（Google、GitHub認証）
- 多要素認証（MFA）対応
- セッション管理の最適化
```

#### 3. Issue活用パターン

**設計フェーズ**:
- 要件定義、技術選択、アーキテクチャ設計をIssue内で議論
- 代替案の比較検討をコメントで記録
- 決定事項と根拠を明確に文書化

**実装フェーズ**:  
- 実装過程の課題・解決策をリアルタイムで記録
- コードスニペットによる具体的な実装内容の共有
- テスト結果・パフォーマンス測定結果の記録

**完了フェーズ**:
- 最終的な成果物の確認
- 学んだ教訓・改善点の記録
- 次のタスクへの引き継ぎ事項

#### 4. Issue管理規約

```markdown
# ラベル体系
- `type/feature` - 新機能開発
- `type/bug` - バグ修正  
- `type/refactor` - リファクタリング
- `type/docs` - ドキュメント更新
- `priority/high` - 高優先度
- `priority/medium` - 中優先度  
- `priority/low` - 低優先度
- `status/in-progress` - 作業中
- `status/review` - レビュー待ち
- `status/blocked` - ブロック状態

# マイルストーン活用
- Phase 1: Foundation Setup
- Phase 2: Core Services  
- Phase 3: UI/UX Implementation
- Phase 4: Quality & Operations

# アサイン規則
- 必ず担当者をアサイン
- 複数人での協業の場合は全員をアサイン
- レビュワーもアサインに含める
```

#### 5. 禁止事項

```markdown
❌ 禁止される Issue 管理パターン:

- 実装過程の記録を残さないまま完了
- 課題・解決策の詳細を記録せずクローズ
- 設計変更の根拠を記載しない
- テスト結果・パフォーマンス測定を記録しない
- 学んだ教訓・改善点を残さない
- コードレビューでの指摘事項を記録しない
```

この規約により、すべての開発過程が追跡可能となり、将来の類似タスクの参考資料として価値の高いナレッジベースを構築できます。

### Linter規約（disable最小化）

#### 1. 基本方針

- **linterのdisableは極力なくす**
- **disable が必要な場合は設定ファイル自体を変更**
- **インラインdisableは禁止（例外的な場合のみ許可）**

#### 2. 禁止されるパターン

```typescript
// ❌ 禁止: インラインでのlinter disable
/* eslint-disable @typescript-eslint/no-explicit-any */
const processData = (data: any) => {  // ❌ 危険
  return data.someProperty
}

// ❌ 禁止: 単一行でのdisable
const result = eval(userInput)  // eslint-disable-line no-eval

// ❌ 禁止: ブロックでのdisable  
/* eslint-disable no-console */
console.log('Debug info')
console.log('More debug info')
/* eslint-enable no-console */

// ❌ 禁止: Biome規則のインラインdisable
// biome-ignore lint/suspicious/noExplicitAny: legacy code
const legacyData: any = getLegacyData()  // ❌ 改修すべき

// ❌ 禁止: 複数規則の一括disable
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
const unsafeCode = someFunction()  // ❌ 根本的解決が必要
```

#### 3. 適切な解決パターン

```typescript
// ✅ 良い例: 設定ファイルでプロジェクト全体に適用
// biome.json
{
  "linter": {
    "rules": {
      "suspicious": {
        "noExplicitAny": "warn",  // エラーからワーニングに変更
        "noConsoleLog": "off"     // 開発段階では無効化
      }
    }
  }
}

// ✅ 良い例: 型定義で根本解決
// ❌ 以前: const data: any = response.data
// ✅ 改善後: 
const ResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  items: z.array(z.object({
    id: z.string(),
    quantity: z.number()
  }))
})

export const processResponse = (data: unknown): Result<ProcessedData, ValidationError> => {
  const parseResult = ResponseSchema.safeParse(data)
  if (!parseResult.success) {
    return err(new ValidationError('Invalid response format'))
  }
  return ok(parseResult.data)  // ✅ 型安全
}

// ✅ 良い例: デバッグログの適切な実装
// ❌ 以前: console.log(debugInfo)  // eslint-disable-line no-console
// ✅ 改善後:
import { logger } from '@repo/logger'

export const processInventoryItem = (item: InventoryItem) => {
  logger.debug('Processing inventory item', {  // ✅ 適切なログレベル
    itemId: item.id,
    name: item.name,
    quantity: item.quantity
  })
  
  // 処理続行...
}

// ✅ 良い例: 安全なeval代替
// ❌ 以前: const result = eval(expression)  // eslint-disable-line no-eval
// ✅ 改善後:
import { Function } from 'vm2'  // 安全なJavaScript実行環境

export const evaluateExpression = (expression: string): Result<number, EvaluationError> => {
  try {
    const vm = new Function(`return ${expression}`)
    const result = vm()
    
    if (typeof result !== 'number') {
      return err('INVALID_RESULT_TYPE')
    }
    
    return ok(result)
  } catch (error) {
    return err('EVALUATION_FAILED')
  }
}

// ✅ 良い例: 外部ライブラリ型定義の適切な対応
// ❌ 以前: const plugin = require('legacy-plugin') as any
// ✅ 改善後: 型定義ファイルを作成
// types/legacy-plugin.d.ts
declare module 'legacy-plugin' {
  export interface PluginConfig {
    apiKey: string
    timeout: number
  }
  
  export class LegacyPlugin {
    constructor(config: PluginConfig)
    process(data: unknown): Promise<ProcessResult>
  }
  
  export default LegacyPlugin
}

// 使用箇所
import LegacyPlugin from 'legacy-plugin'  // ✅ 型安全

const plugin = new LegacyPlugin({
  apiKey: config.PLUGIN_API_KEY,
  timeout: 5000
})
```

#### 4. 設定ファイル変更パターン

```json
// ✅ 良い例: biome.json での適切な設定調整
{
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "suspicious": {
        "noExplicitAny": "warn",              // 段階的改善のためワーニング
        "noConsoleLog": "off"                 // 開発時は許可
      },
      "style": {
        "useConst": "error",                  // constの使用を強制
        "useShorthandArrayType": "warn"       // T[]形式を推奨
      },
      "correctness": {
        "noUnusedVariables": "error",         // 未使用変数は厳格にチェック
        "noUnreachableCode": "error"          // 到達不可能コードを厳格チェック
      },
      "complexity": {
        "noForEach": "off",                   // forEachの使用を許可（プロジェクト方針）
        "useLiteralKeys": "warn"              // リテラルキー使用を推奨
      }
    }
  },
  "files": {
    "ignore": [
      "dist/**",
      "node_modules/**",
      "**/*.generated.ts",                    // 自動生成ファイルは除外
      "**/migrations/**/*.sql"                // マイグレーションファイルは除外
    ]
  }
}

// ✅ 良い例: package.json での環境別設定
{
  "scripts": {
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "lint:ci": "biome ci .",
    "lint:dev": "biome check --config-path ./biome.dev.json ."
  }
}

// biome.dev.json（開発環境用）
{
  "extends": "./biome.json",
  "linter": {
    "rules": {
      "suspicious": {
        "noConsoleLog": "off",                // 開発時はconsole.log許可
        "noDebugger": "warn"                  // debuggerはワーニング
      }
    }
  }
}

// biome.prod.json（本番環境用）  
{
  "extends": "./biome.json",
  "linter": {
    "rules": {
      "suspicious": {
        "noConsoleLog": "error",              // 本番では厳格
        "noDebugger": "error",                // debuggerは絶対禁止
        "noExplicitAny": "error"              // any型は厳格チェック
      }
    }
  }
}
```

#### 5. 例外的にdisableが許可されるケース

```typescript
// ✅ 例外的に許可: サードパーティライブラリの型問題（一時的）
// 理由をコメントで明記し、Issue番号を記載
/* eslint-disable @typescript-eslint/no-explicit-any -- 
 * TODO: Fix in #123 - legacy-lib has no type definitions
 * Remove this disable once types are available
 */
import legacyLib from 'legacy-lib'

// ✅ 例外的に許可: テストコードでのみ（限定的）
// テスト固有の制約がある場合のみ
describe('Error handling', () => {
  it('should handle network errors', () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    // 理由: テストでは意図的にPromiseを無視してエラーをテスト
    networkService.unreliableCall()
    
    expect(errorHandler.lastError).toBeDefined()
  })
})

// ✅ 例外的に許可: 自動生成コードファイル
// ファイル全体で一括disable（自動生成であることを明記）
/* eslint-disable */
// This file is auto-generated by Prisma Client
// Do not edit manually - changes will be overwritten

export const PrismaClient = {
  // 自動生成されたコード...
}
```

#### 6. 代替解決策の検討順序

1. **設定ファイル変更**: ルール自体を調整・無効化
2. **コード改善**: より良い実装パターンに変更
3. **型定義追加**: 不足している型定義を補完
4. **ライブラリ変更**: より型安全なライブラリに移行
5. **最終手段**: 十分な理由とIssue番号付きでdisable

#### 7. チームでの運用ルール

```markdown
## Linter Disable Review Process

### Before Disable:
1. 設定ファイル変更で解決できないか検討
2. コード改善で根本解決できないか検討  
3. 他の実装方法がないか検討

### If Disable Required:
1. GitHub Issueを作成（改善計画を記載）
2. コメントでdisableの理由と期限を明記
3. PR レビューで必ず確認・承認を得る
4. 定期的にdisable箇所をレビュー・改善

### Monitoring:
- 月次でdisable箇所の棚卸し実施
- 不要になったdisableの削除
- 恒久的な解決策への移行検討
```

この規約により、コード品質を維持しながら、linter規則の適切な管理が実現されます。

## まとめ

この規約に従うことで：

1. **型安全性**: コンパイル時エラー検出、ランタイムエラー削減
2. **簡潔性**: 最小限の記述量、セルフドキュメンティングコード
3. **保守性**: 一貫したコード構造、理解しやすいアーキテクチャ
4. **テスタビリティ**: 
   - Given-When-Then構造、Rails風ネストによる明確なテスト
   - `*.spec.ts` = 単体テスト（モック使用）
   - `*.test.ts` = 結合テスト（実依存関係使用）
5. **パフォーマンス**: const + アロー関数、効率的なクエリ
6. **セキュリティ**: 入力値検証、認証・認可、監査ログ
7. **スケーラビリティ**: DDD/Clean Architectureによる拡張性

**開発原則**:
- `function`より`const` + アロー関数を優先
- コメントより型とシグネチャで意図を表現
- 記述量は最小限（パフォーマンス影響がない限り）
- **if文・switch文では必ずブロック`{}`を使用**
- **関数・メソッドは25行以内に必ず収める（長い場合は分割）**
- **`then`チェーンは極力使わず、`async/await`で統一**
- **ファイル名は必ずケバブケース、ディレクトリでレイヤー表現時は接尾辞不要**
- **変数名・関数名はcamelCase、クラス・型名はPascalCase**
- **関数名・メソッド名は動詞で始める（action-oriented naming）**
- **boolean変数は`is`、`has`、`can`、`should`、`will`などの接頭語を使用**
- **ReactコンポーネントはPascalCase + named export（default export禁止）**
- **Custom Hookはuseプレフィックス + camelCase**
- **インターフェースは具体名、`I`プレフィックス・`***Interface`接尾辞禁止**
- **Enumは避けUnion型で表現、配列は`ReadonlyArray`推奨**
- **`interface`より`type`を優先、`type-fest`活用で複雑な型を簡潔に**
- **関数引数の型は抽出して定義、環境変数は`zod`で型安全に取得**
- **すべてのAs-Is系ドキュメントは自動生成（手動作成・更新禁止）**
- Given-When-Thenによる明確なテスト構造
- **1つのitに1つのexpect（RSpec風）**
- **`*.spec.ts` = 単体テスト（モック積極使用）**
- **`*.test.ts` = 結合テスト（モック最小限）**

すべての開発者がこの規約を遵守し、コードレビューで品質を担保することで、高品質で保守性の高い備蓄管理アプリケーションを構築できます。
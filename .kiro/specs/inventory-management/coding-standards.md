# コード規約・開発標準

## 概要

備蓄管理アプリケーションの開発における統一されたコード規約とベストプラクティス。Flutter、TypeScript、gRPC、DDD/Clean Architectureに対応した包括的な開発標準。

## 全般的な原則

### 1. 型安全性ファースト
- すべてのコードで型安全性を最優先
- `any`型の使用禁止（やむを得ない場合は`unknown`を使用）
- Protocol Buffersによる厳密な型定義
- Dartでの`dynamic`型使用最小化

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

### 型定義規約

```typescript
// ✅ 良い例: Opaque型による識別子の型安全性
import { Opaque } from 'type-fest';

export type UserId = Opaque<string, 'UserId'>;
export type OrganizationId = Opaque<string, 'OrganizationId'>;
export type InventoryItemId = Opaque<string, 'InventoryItemId'>;

// ✅ 良い例: 厳密な型定義
export interface CreateInventoryItemRequest {
  readonly name: string;
  readonly brand?: string;
  readonly category: InventoryCategory;
  readonly quantity: number;
  readonly unit: string;
  readonly minQuantity?: number;
  readonly expiryDate?: Date;
  readonly bestBeforeDate?: Date;
  readonly expiryType: ExpiryType;
  readonly storageLocation?: string;
  readonly price?: Money;
  readonly barcode?: string;
  readonly asin?: string;
  readonly tags: readonly string[];
  readonly notes?: string;
}

// ❌ 悪い例: 曖昧な型定義
export interface CreateItemRequest {
  name: any;
  data: object;
  options?: any;
}
```

### エラーハンドリング規約

```typescript
// ✅ 良い例: neverthrow Result型での簡潔なエラーハンドリング
import { Result, ok, err } from 'neverthrow'

export type CreateInventoryItemError = 
  | 'VALIDATION_ERROR'
  | 'PERMISSION_DENIED'
  | 'ORGANIZATION_NOT_FOUND'
  | 'DUPLICATE_BARCODE'

export const createInventoryItem = async (
  request: CreateInventoryItemRequest
): Promise<Result<InventoryItem, CreateInventoryItemError>> => {
  const validationResult = validateCreateRequest(request)
  if (validationResult.isErr()) {
    return err('VALIDATION_ERROR')
  }

  try {
    const item = await inventoryRepository.create(request)
    return ok(item)
  } catch (error) {
    if (error instanceof PermissionError) {
      return err('PERMISSION_DENIED')
    }
    if (error instanceof DuplicateBarcodeError) {
      return err('DUPLICATE_BARCODE')
    }
    throw error
  }
}

// neverthrowの場合はチェーンも許可（関数型スタイル）
const validateAndCreate = (request: CreateInventoryItemRequest) =>
  validateCreateRequest(request)
    .andThen(() => inventoryRepository.create(request))
    .mapErr(mapToCreateItemError)

// ❌ 悪い例: 冗長なエラーハンドリング
export async function createItem(request: any): Promise<any> {
  try {
    // 何をしているかわからない
    return await repository.create(request);
  } catch (error) {
    // 意味のないエラーメッセージ
    throw new Error('Something went wrong');
  }
}
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

### 関数定義規約（分割代入活用 + let最小化）

```typescript
// ✅ 良い例: 分割代入 + const のみ使用
export const calculateExpiryStatus = ({
  expiryDate,
  currentDate = new Date()
}: {
  expiryDate: Date
  currentDate?: Date
}): ExpiryStatus => {
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
}

// 分割代入で複数の値を返す
export const parseInventoryItem = (data: unknown) => {
  const { id, name, quantity, expiryDate } = data as RawInventoryData
  const isValid = id && name && quantity >= 0
  
  return { 
    item: isValid ? { id, name, quantity, expiryDate } : null,
    isValid 
  }
}

// 引数の分割代入でコードを簡潔に
export const createInventoryItem = async ({
  name,
  quantity,
  unit,
  organizationId,
  expiryDate,
  ...optionalFields
}: CreateInventoryItemRequest): Promise<Result<InventoryItem, CreateError>> => {
  // letを使わず、constで値を作成
  const validatedName = name.trim()
  const normalizedQuantity = Math.max(0, quantity)
  
  const item = {
    name: validatedName,
    quantity: normalizedQuantity,
    unit,
    organizationId,
    expiryDate,
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

// ❌ 悪い例: function宣言（必要な場合以外は避ける）
function calculateExpiryStatus(expiryDate: Date): ExpiryStatus {
  // 冗長なコメント（型で表現できる）
  const currentDate = new Date() // 現在日時を取得
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  // 期限切れチェック
  if (daysUntilExpiry < 0) return 'EXPIRED';
  // ...
}

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

## Flutter/Dart コード規約

### ファイル・ディレクトリ命名規則

```dart
// ✅ 良い例
// ファイル名: snake_case
inventory_item.dart
user_authentication_service.dart
organization_member_entity.dart

// ディレクトリ名: snake_case
lib/
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
    ├── pages/
    ├── widgets/
    └── providers/
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
  }

  @override
  List<Object?> get props => [
        id,
        organizationId,
        name,
        brand,
        category,
        quantity,
        unit,
        minQuantity,
        expiryDate,
        bestBeforeDate,
        expiryType,
        storageLocation,
        price,
        barcode,
        asin,
        tags,
        images,
        notes,
        createdAt,
        updatedAt,
      ];
}
```

### Riverpod プロバイダー規約

```dart
// ✅ 良い例: Riverpod プロバイダー定義
// リポジトリプロバイダー
final inventoryRepositoryProvider = Provider<InventoryRepository>((ref) {
  final grpcClient = ref.read(grpcClientProvider);
  final authToken = ref.read(authTokenProvider);
  return InventoryRepositoryImpl(grpcClient, authToken);
});

// ユースケースプロバイダー
final getInventoryItemsUseCaseProvider = Provider<GetInventoryItems>((ref) {
  final repository = ref.read(inventoryRepositoryProvider);
  return GetInventoryItems(repository);
});

// 状態プロバイダー（FutureProvider）
final inventoryItemsProvider = FutureProvider.family<List<InventoryItem>, String>(
  (ref, organizationId) async {
    final useCase = ref.read(getInventoryItemsUseCaseProvider);
    return await useCase(organizationId);
  },
);

// 状態プロバイダー（StateProvider）
final selectedInventoryItemProvider = StateProvider<InventoryItem?>(
  (ref) => null,
);

// 検索・フィルタリングプロバイダー
final inventorySearchQueryProvider = StateProvider<String>((ref) => '');

final filteredInventoryItemsProvider = Provider<AsyncValue<List<InventoryItem>>>(
  (ref) {
    final itemsAsync = ref.watch(inventoryItemsProvider('current_org_id'));
    final searchQuery = ref.watch(inventorySearchQueryProvider);
    
    return itemsAsync.when(
      data: (items) {
        if (searchQuery.isEmpty) {
          return AsyncValue.data(items);
        }
        
        final filtered = items.where((item) =>
          item.name.toLowerCase().contains(searchQuery.toLowerCase()) ||
          (item.brand?.toLowerCase().contains(searchQuery.toLowerCase()) ?? false)
        ).toList();
        
        return AsyncValue.data(filtered);
      },
      loading: () => const AsyncValue.loading(),
      error: (error, stack) => AsyncValue.error(error, stack),
    );
  },
);

// ❌ 悪い例: 複雑すぎるプロバイダー
final complexProvider = Provider((ref) {
  // 複数の責任を持つプロバイダー（単一責任原則違反）
  final data = ref.watch(someDataProvider);
  final user = ref.watch(userProvider);
  final settings = ref.watch(settingsProvider);
  
  // 複雑なロジック（ここに書くべきではない）
  return processComplexLogic(data, user, settings);
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

```dart
// ✅ 良い例: Flutter gRPCクライアント
class InventoryRepositoryImpl implements InventoryRepository {
  @override
  Future<Either<InventoryFailure, InventoryItem>> createItem(
    CreateInventoryItemRequest request,
  ) async {
    try {
      final grpcRequest = _mapToGrpcRequest(request);
      final response = await _grpcClient
          .inventoryWithAuth(_authToken)
          .createItem(grpcRequest);
      
      final item = InventoryItemModel.fromGrpc(response).toEntity();
      return Right(item);
    } on GrpcError catch (e) {
      return Left(_mapGrpcErrorToFailure(e));
    } catch (e) {
      return Left(const InventoryFailure.unexpected());
    }
  }

  InventoryFailure _mapGrpcErrorToFailure(GrpcError error) {
    switch (error.code) {
      case StatusCode.unauthenticated:
        return const InventoryFailure.unauthenticated();
      case StatusCode.permissionDenied:
        return const InventoryFailure.permissionDenied();
      case StatusCode.notFound:
        return const InventoryFailure.organizationNotFound();
      case StatusCode.invalidArgument:
        return InventoryFailure.validationError(error.message ?? '');
      case StatusCode.alreadyExists:
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

  // ビジネスロジック
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

  public updateQuantity(newQuantity: number): Result<void, ValidationError> {
    if (newQuantity < 0) {
      return err(new ValidationError('Quantity cannot be negative'));
    }

    this._props.quantity = newQuantity;
    this._updatedAt = new Date();

    return ok(undefined);
  }

  public getExpiryStatus(currentDate: Date = new Date()): ExpiryStatus {
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

  public isLowStock(): boolean {
    return this._props.minQuantity !== undefined && 
           this._props.quantity <= this._props.minQuantity;
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

### Flutter テスト規約（Given-When-Then + Rails風ネスト構造 + 1 expect per test）

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
chore(deps): update Flutter dependencies

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

```dart
// ✅ 良い例: Flutter パフォーマンス最適化
class InventoryListWidget extends ConsumerWidget {
  @override
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
- **`then`チェーンは極力使わず、`async/await`で統一**
- **ファイル名は必ずケバブケース、ディレクトリでレイヤー表現時は接尾辞不要**
- Given-When-Thenによる明確なテスト構造
- **1つのitに1つのexpect（RSpec風）**
- **`*.spec.ts` = 単体テスト（モック積極使用）**
- **`*.test.ts` = 結合テスト（モック最小限）**

すべての開発者がこの規約を遵守し、コードレビューで品質を担保することで、高品質で保守性の高い備蓄管理アプリケーションを構築できます。
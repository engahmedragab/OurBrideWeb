# Purchase Service

A comprehensive service for handling all purchase-related operations including cart management, orders, checkout, and coupons.

## Location
`src/services/purchaseService.ts`

## Usage

```typescript
import { purchaseService } from '../services/purchaseService';
```

## API Methods

### Purchase Operations

#### Create Purchase
```typescript
const purchase = await purchaseService.purchase.create(purchaseRequest);
```

#### Get All Purchases
```typescript
const purchases = await purchaseService.purchase.getAll();
```

#### Get Purchase by ID
```typescript
const purchase = await purchaseService.purchase.getById(purchaseId);
```

#### Update Purchase
```typescript
const updated = await purchaseService.purchase.update(purchaseId, updateRequest);
```

#### Remove Purchase
```typescript
await purchaseService.purchase.remove(purchaseId, removeRequest);
```

### Cart Operations

#### Get Current Cart
```typescript
const cart = await purchaseService.cart.get();
```

#### Get Purchases by Cart
```typescript
const purchases = await purchaseService.cart.getPurchases();
```

#### Get All Carts with Providers
```typescript
const cartsWithProviders = await purchaseService.cart.getAllWithProviders();
```

#### Clear Entire Cart
```typescript
await purchaseService.cart.clear();
```

#### Get Cart by Provider
```typescript
const cart = await purchaseService.cart.getByProvider(providerId);
```

#### Clear Cart by Provider
```typescript
await purchaseService.cart.clearByProvider(providerId);
```

#### Get Purchases by Provider Cart
```typescript
const purchases = await purchaseService.cart.getPurchasesByProvider(providerId);
```

### Order Operations

#### Create Order
```typescript
const order = await purchaseService.order.create(checkoutRequest);
```

#### Search Orders (Paginated)
```typescript
const orders = await purchaseService.order.search(searchRequest);
```

### Checkout Operations

#### Process Checkout
```typescript
const result = await purchaseService.checkout.process(checkoutRequest);
```

### Coupon Operations

#### Validate Coupon
```typescript
const validation = await purchaseService.coupon.validate(couponCode);
```

### Reservation Operations

#### Get Purchases by Reservation ID
```typescript
const purchases = await purchaseService.reservation.getPurchasesByReservationId(reservationId);
```

## Request Types

The service uses the following request types (imported from the generated API):

- `PurchaseRequest` - For creating purchases
- `PurchaseUpdateRequest` - For updating purchases
- `PurchaseRemoveRequest` - For removing purchases
- `CheckoutRequest` - For checkout and order creation
- `ServiceOrderSearchRequest` - For searching orders

## Response Format

All methods automatically extract data from the `ApiResult` format:

```typescript
{
  success: boolean,
  statusCode: number,
  data: T
}
```

The service returns only the `data` property.

## Error Handling

Errors are not caught by the service - they should be handled by the calling component:

```typescript
try {
  const cart = await purchaseService.cart.get();
} catch (error) {
  console.error('Failed to get cart:', error);
  // Handle error
}
```

## Example Usage in Component

```typescript
import React, { useEffect, useState } from 'react';
import { purchaseService } from '../services/purchaseService';

function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const data = await purchaseService.cart.get();
        setCart(data);
      } catch (error) {
        console.error('Failed to load cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleCheckout = async () => {
    try {
      const checkoutRequest = {
        // ... checkout data
      };
      const result = await purchaseService.checkout.process(checkoutRequest);
      // Handle success
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  // ... rest of component
}
```

## Related Files

- `src/common/api/gen/ourbride-api.ts` - Generated API client
- `src/common/api/ourbride-http-client.ts` - HTTP client wrapper
- `src/pages/orders/Cart.tsx` - Cart page component
- `src/pages/orders/Checkout.tsx` - Checkout page component
- `src/pages/orders/MyOrders.tsx` - Orders list component


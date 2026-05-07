# Security Specification for DigiTechLabs

## 1. Data Invariants
- An **Order** must have a `userId` matching the authenticated user.
- A **Product** update/delete can only be performed by an **Admin**.
- A **Review** must be linked to a valid `productId` and the `userId` must match the author.
- User **Roles** can only be modified by an existing **Admin**.
- Terminal order statuses (e.g., `delivered`, `cancelled`) are immutable by customers.

## 2. The Dirty Dozen Payloads (Target: Access & Integrity)

1. **Identity Spoofing**: Attempt to create an order with a `userId` that is not mine.
2. **Privilege Escalation**: Attempt to update my own user profile to set `role: 'admin'`.
3. **Ghost Fields**: Attempt to add `isVerified: true` to a product I don't own.
4. **ID Poisoning**: Attempt to create a product with a 2KB string as ID to exhaust resources.
5. **Relationship Orphanage**: Attempt to create a review for a non-existent product.
6. **Price Manipulation**: Attempt to create an order with a price below the product's actual price (requires backend verification, but rules should block obvious mismatches if possible).
7. **Cross-User Leak**: Attempt to list all orders in the system without an admin role.
8. **Immutability Bypass**: Attempt to update the `createdAt` timestamp on an existing order.
9. **Status Shortcutting**: Attempt to move an order from `pending` directly to `delivered` as a customer.
10. **Shadow Profiles**: Attempt to create a user profile for a different UID.
11. **Resource Exhaustion**: Send a review comment that is 1MB in size.
12. **Missing Gate**: Attempt to delete a category without being an admin.

## 3. Test Runner (Draft)
The `firestore.rules.test.ts` will verify these scenarios using the Firebase Emulators (simulated here through logic).

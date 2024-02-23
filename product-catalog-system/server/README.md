# Advanced Product Catalog System: Backend

## Models

**USER**
```
{
    name: String,
    email: String,
    password: String,
    role: String, //["customer", "moderator", "admin"]
    isDeleted: Boolean
}
```

**PRODUCT**
```
{
    name: String, 
    description: String,
    price: Number,
    image: String,
    isAdminApproved: Boolean,
    isDeleted: Boolean,
    cataloguerId: ObjectId
}
```

## API Documentation

| # | METHOD | URL | AUTH | ACCESS | BODY | RESPONSE | DESCRIPTION |
|---|--------|-----|------|--------|------|----------|-------------|
| 1. | POST | /api/auth/signup | NO | NA | `{name, email, password}` | `token` | register new user |
| 2. | POST | /api/auth/login | NO | NA | `{email, password}` | `token` | user login |
| 3. | GET | /api/auth/logout | YES | private | NA | `token` | user logout |
| 4. | GET | /api/admin/users/ | admin | NA | NA | `[{user}]` | get all users except admin |
| 5. | DELETE | /api/admin/users/delete/:userId | admin | NA | NA | `message` | soft delete user |
| 6. | PUT | /api/admin/users/restore/:userId | admin | NA | NA | `message` | restore soft deleted user |
| 7. | PUT | /api/admin/users/upgrade/:userId | admin | NA | NA | `message` | change user role to moderator |
| 8. | POST | /api/admin/products | moderator, admin | NA | `{name, description, price, image}` | `message` | add a product |
| 9. | GET | /api/products/approved | YES | public | NA | `[{product}]` | get all admin approved products |
| 10. | GET | /api/admin/products?approved=false | admin | NA | NA | `[{product}]` | get all unapproved products |
| 11. | GET | /api/admin/products | moderator, admin | NA | NA | `[{product}]` | get all products |
| 12. | PUT | /api/admin/products/:productId | moderator, admin | NA | `{name, description, price, image}` | `message` | update product info |
| 13. | PUT | /api/admin/products/approve/:productId | admin | NA | NA | `message` | approve a product |
| 14. | DELETE | /api/admin/products/delete/:productId | moderator, admin | NA | NA | `message` | soft delete a product |
| 15. | DELETE | /api/admin/products/restore/:productId | moderator, admin | NA | NA | `message` | restore soft deleted product |
| 16. | DELETE | /api/admin/products/:productId | admin | NA | NA | `message` | hard delete a product |
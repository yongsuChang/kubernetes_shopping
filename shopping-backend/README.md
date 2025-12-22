# Backend Development Guide

## Entity Mapping
- All base entities (Member, Vendor, Product, etc.) should be implemented in the `common` module.
- Refer to `01_brain_storming.md` -> Section 5. Data Model (Tables) for detailed field definitions.

## Modules
- `admin-api`: Root admin features. (Port: 8081)
- `shop-api`: Vendor admin & Customer features. (Port: 8082)
- `common`: Shared Entities, Enums, DTOs, Security Utils.

## Security
- JWT based authentication.
- Roles: ROLE_SUPER_ADMIN, ROLE_SHOP_ADMIN, ROLE_USER.
- CORS Origins are managed via `application.yaml`.

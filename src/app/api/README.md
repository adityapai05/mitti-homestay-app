# MITTI - API Documentation

 ## Authentication API

All authentication endpoints require a valid Firebase session cookie (`__session`) unless otherwise noted.
Firebase ID tokens are used for login, and session cookies persist authentication.

---

 ### **POST `/api/auth/sync`**

Syncs a Firebase-authenticated user into PostgreSQL.
Used after Firebase login to ensure a user record exists in the database.

**Headers:**
`Authorization: Bearer <firebase-id-token>`

#### Responses:

* **200 OK**

```json
{
  "success": true,
  "user": {
    "id": "db-user-id",
    "uid": "firebase-uid",
    "email": "user@example.com",
    "displayName": "Jane Doe",
    "photoURL": "https://example.com/avatar.png"
  }
}
```

* **401 Unauthorized**

```json
{ "success": false, "error": "Missing or invalid Authorization header" }
```

* **500 Internal Server Error**

```json
{ "error": "Internal Server Error" }
```

---

### **GET `/api/auth/user`**

Returns the currently authenticated user.

**Headers:**
`Cookie: __session=<token>`

#### Responses:

* **200 OK**

```json
{
  "id": "uuid",
  "firebaseUid": "firebase-uid",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+91 9876543210",
  "image": "https://example.com/photo.jpg",
  "role": "HOST",
  "isVerified": true,
  "createdAt": "2025-07-29T13:19:17.874Z",
  "updatedAt": "2025-08-27T14:13:57.997Z"
}
```

* **401 Unauthorized**

```json
{ "error": "Unauthorized or user not found" }
```

---

### **PATCH `/api/auth/user`**

Updates user details (name, phone, profile image).

**Request (JSON):**

```json
{
  "name": "John Doe",
  "phoneNumber": "+91 9999999999",
  "profileImage": "https://example.com/photo.jpg"
}
```

#### Responses:

* **200 OK**

```json
{
  "id": "uuid",
  "firebaseUid": "firebase-uid",
  "name": "John Doe",
  "email": "jane@example.com",
  "phone": "+91 9999999999",
  "image": "https://example.com/photo.jpg",
  "role": "HOST",
  "isVerified": true,
  "createdAt": "2025-07-29T13:19:17.874Z",
  "updatedAt": "2025-08-27T15:18:40.522Z"
}
```

* **400 Bad Request**

```json
{ "error": "No fields to update" }
```

* **401 Unauthorized**

```json
{ "error": "Unauthorized - Missing Session Cookie" }
```

* **500 Internal Server Error**

```json
{ "error": "Internal Server Error" }
```

---

### **DELETE `/api/auth/user`**

Deletes the current user account (both Firebase + PostgreSQL record).
Also clears the session cookie.

#### Responses:

* **200 OK**

```json
{ "success": true }
```

* **401 Unauthorized**

```json
{ "error": "Unauthorized - Missing Session Cookie" }
```

* **500 Internal Server Error**

```json
{ "error": "Internal Server Error" }
```

---

### **POST `/api/auth/session`**

Creates a session cookie for Firebase authentication.

**Request (JSON):**

```json
{ "idToken": "firebase-id-token" }
```

#### Responses:

* **200 OK**

```json
{ "success": true }
```

* **401 Unauthorized**

```json
{ "error": "Failed to create session" }
```

---

### **DELETE `/api/auth/session`**

Logs out the user by clearing the session cookie.

#### Responses:

* **200 OK**

```json
{ "success": true }
```
---


## Homestays API

Homestay CRUD and browsing endpoints.
Requires authentication for `POST`, `PUT`, and `DELETE`.

---

### **GET `/api/homestays`**

List and filter homestays. Supports pagination and multiple filters.

**Query Parameters:**

* `category` → Filter by category (e.g. `ECO_LODGE`)
* `maxGuests` → Minimum guest capacity
* `minPrice` / `maxPrice` → Price range
* `type` → Optional type field
* `rating` → Minimum rating
* `amenities` → Multiple amenities (`?amenities=wifi&amenities=parking`)
* `cursor` → Cursor ID for pagination
* `limit` → Number of results per page (default: 20)
* `isVerified` → `true`/`false`
* `guideAvailable` → `true`/`false`

**Responses:**

* **200 OK**

```json
{
  "homestays": [
    {
      "id": "uuid",
      "name": "Eco Retreat",
      "pricePerNight": 120,
      "category": "ECO_LODGE",
      "isVerified": true
    }
  ],
  "nextCursor": "uuid-of-next",
  "hasNextPage": true
}
```

* **500 Internal Server Error**

```json
{ "error": "Internal Server Error" }
```

---

### **POST `/api/homestays/create`**

Create a new homestay (requires `HOST` role).

**Request (JSON):**

```json
{
  "name": "Mountain View Lodge",
  "description": "Peaceful retreat in the hills",
  "address": "123 Hilltop Road",
  "latitude": 27.175,
  "longitude": 78.042,
  "pricePerNight": 150,
  "beds": 3,
  "maxGuests": 6,
  "imageUrl": "https://example.com/photo.jpg",
  "amenities": ["wifi", "parking"],
  "guideAvailable": true,
  "guideFee": 20,
  "category": "MOUNTAIN_RETREAT",
  "checkInTime": "14:00",
  "checkOutTime": "11:00"
}
```

**Responses:**

* **201 Created**

```json
{
  "id": "uuid",
  "name": "Mountain View Lodge",
  "pricePerNight": 150,
  "ownerId": "host-uuid",
  "category": "MOUNTAIN_RETREAT"
}
```

* **400 Bad Request**

```json
{ "error": { "name": "Name must be at least 3 characters" } }
```

* **403 Forbidden**

```json
{ "error": "Only hosts can create homestays." }
```

* **500 Internal Server Error**

```json
{ "error": "Internal Server Error" }
```

---

### **GET `/api/homestays/[id]`**

Fetch details of a homestay.

**Responses:**

* **200 OK**

```json
{
  "id": "uuid",
  "name": "Eco Lodge Retreat",
  "description": "Beautiful eco-friendly lodge...",
  "pricePerNight": 120,
  "owner": {
    "id": "host-uuid",
    "name": "John Host",
    "image": "https://example.com/owner.jpg"
  }
}
```

* **400 Bad Request**

```json
{ "error": "Homestay ID is required." }
```

* **404 Not Found**

```json
{ "error": "Homestay Not Found." }
```

* **500 Internal Server Error**

```json
{ "error": "Internal Server Error" }
```

---

### **PUT `/api/homestays/[id]`**

Update homestay details (requires `HOST` and ownership).

**Request (JSON):**

```json
{
  "name": "Updated Name",
  "pricePerNight": 200,
  "maxGuests": 8
}
```

**Responses:**

* **200 OK**

```json
{
  "id": "uuid",
  "name": "Updated Name",
  "pricePerNight": 200,
  "maxGuests": 8,
  "owner": { "id": "host-uuid", "name": "John Host" }
}
```

* **400 Bad Request**

```json
{ "error": { "name": "Name must be at least 3 characters" } }
```

* **403 Forbidden**

```json
{ "error": "You can only update your own homestays" }
```

* **404 Not Found**

```json
{ "error": "Homestay not found." }
```

* **500 Internal Server Error**

```json
{ "error": "Internal Server Error" }
```

---

### **DELETE `/api/homestays/[id]`**

Delete a homestay (requires `HOST` and ownership).
Prevents deletion if active/upcoming bookings exist.

**Responses:**

* **200 OK**

```json
{
  "message": "Homestay deleted successfully.",
  "deletedHomestayId": "uuid"
}
```

* **400 Bad Request**

```json
{
  "error": "Cannot delete homestay with active or upcoming bookings. Please wait for bookings to complete or contact support."
}
```

* **403 Forbidden**

```json
{ "error": "You can only delete your own homestays." }
```

* **404 Not Found**

```json
{ "error": "Homestay not found." }
```

* **500 Internal Server Error**

```json
{ "error": "Internal Server Error" }
```
---
Perfect — thanks for pasting the full `/api/bookings` suite (list, create, by-id GET/PUT/DELETE). Right now your code looks consistent and REST-y, but your docs should reflect:

* **Authentication required everywhere** (all routes use `getCurrentUser()`)
* **Multiple response codes per endpoint** (not just 200/201, but also 400, 401, 403, 404, 500)
* **Extra fields in responses** like `bookingStatus`, `pagination`, `refundInfo`

---

## Booking API

All booking endpoints require a valid Firebase session cookie (`__session`).
Errors are returned as JSON:

```json
{ "error": "Message describing the error" }
```

---

### `GET /api/bookings`

Fetch a paginated list of the authenticated user’s bookings.

**Query Params:**

* `status` (optional) – filter by booking status (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`)
* `upcoming=true` – only show upcoming bookings
* `past=true` – only show past bookings
* `limit` (default 20) – items per page
* `page` (default 1) – page number

**Response (200):**

```json
{
  "bookings": [
    {
      "id": "uuid",
      "checkIn": "2025-09-01T12:00:00Z",
      "checkOut": "2025-09-05T12:00:00Z",
      "status": "CONFIRMED",
      "nights": 4,
      "bookingStatus": {
        "canCancel": true,
        "canComplete": false,
        "isActive": false,
        "isUpcoming": true,
        "isPast": false
      },
      "homestay": {
        "id": "uuid",
        "name": "Cozy Cottage",
        "address": "123 Lane",
        "imageUrl": "https://...",
        "owner": {
          "id": "uuid",
          "name": "Host Name",
          "image": "https://..."
        }
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalCount": 25,
    "hasNextPage": true,
    "hasPrevPage": false,
    "limit": 20
  }
}
```

**Error Codes:**

* `401 Unauthorized` – not logged in
* `500 Internal Server Error`

---

### `POST /api/bookings/create`

Create a new booking.

**Request JSON:**

```json
{
  "homestayId": "uuid",
  "checkIn": "2025-09-10",
  "checkOut": "2025-09-12",
  "guests": 2
}
```

**Response (201):**

```json
{
  "message": "Booking created successfully!",
  "booking": {
    "id": "uuid",
    "status": "PENDING",
    "checkIn": "2025-09-10T00:00:00Z",
    "checkOut": "2025-09-12T00:00:00Z",
    "nights": 2,
    "totalPrice": "200.00",
    "homestay": { "id": "uuid", "name": "Cozy Cottage" },
    "user": { "id": "uuid", "name": "Guest Name" }
  },
  "nights": 2
}
```

**Error Codes:**

* `400 Bad Request` – invalid dates, over guest limit, or host booking own homestay
* `401 Unauthorized` – not logged in
* `404 Not Found` – homestay not found
* `500 Internal Server Error`

---

### `GET /api/bookings/[id]`

Fetch details of a single booking. Only booking owner or homestay owner can view.

**Response (200):**

```json
{
  "id": "uuid",
  "status": "CONFIRMED",
  "checkIn": "2025-09-10T00:00:00Z",
  "checkOut": "2025-09-12T00:00:00Z",
  "nights": 2,
  "bookingStatus": {
    "canCancel": true,
    "canComplete": false,
    "isActive": false,
    "isUpcoming": true,
    "isPast": false
  },
  "homestay": { "id": "uuid", "name": "Cozy Cottage", "owner": { "id": "uuid", "name": "Host Name" } },
  "user": { "id": "uuid", "name": "Guest Name" }
}
```

**Error Codes:**

* `400 Bad Request` – booking ID missing
* `401 Unauthorized` – not logged in
* `403 Forbidden` – not booking owner or homestay owner
* `404 Not Found` – booking not found
* `500 Internal Server Error`

---

### `PUT /api/bookings/[id]`

Update booking status (only valid transitions are allowed).

**Request JSON:**

```json
{ "status": "CONFIRMED" }
```

**Response (200):**

```json
{
  "message": "Booking confirmed successfully! Guest will be notified.",
  "booking": { "id": "uuid", "status": "CONFIRMED", "homestay": { "id": "uuid", "name": "Cozy Cottage" } }
}
```

**Special Cases:**

* `CANCELLED` → may include refund info

```json
{
  "refundInfo": {
    "refundAmount": "100.00",
    "refundPolicy": "partial",
    "processingTime": "3-5 business days"
  }
}
```

**Error Codes:**

* `400 Bad Request` – invalid status or timing (too late to cancel, etc.)
* `401 Unauthorized` – not logged in
* `403 Forbidden` – not booking owner/host or invalid action
* `404 Not Found` – booking not found
* `500 Internal Server Error`

---

### `DELETE /api/bookings/[id]`

Cancel a booking. Same rules as PUT but explicitly cancels.
Refund info may be included in the response.

**Response (200):**

```json
{
  "message": "Booking cancelled successfully.",
  "refundInfo": {
    "refundAmount": "200.00",
    "refundPolicy": "full",
    "processingTime": "3-5 business days"
  }
}
```

**Error Codes:**

* `400 Bad Request` – already cancelled, completed, or too late
* `401 Unauthorized` – not logged in
* `403 Forbidden` – no permission to cancel
* `404 Not Found` – booking not found
* `500 Internal Server Error`





Got it — this `/api/reviews/[homestayId]` endpoint is two things in one:

* **GET** → list reviews for a specific homestay (with pagination, filters, stats, rating distribution).
* **POST** → create a new review for a homestay (tied to a completed booking).
---

## Reviews API

All review routes are scoped to a homestay:
`/api/reviews/[homestayId]`

---

### `GET /api/reviews/[homestayId]`

Fetch paginated reviews for a specific homestay.

**Query Params:**

* `limit` (default `20`) – number of reviews per page
* `page` (default `1`) – page number
* `rating` (optional) – filter by specific star rating (`1`–`5`)
* `sortBy` (optional) – sort order:

  * `newest` (default)
  * `oldest`
  * `highest` (rating)
  * `lowest` (rating)

**Response (200):**

```json
{
  "reviews": [
    {
      "id": "uuid",
      "rating": 5,
      "comment": "Great stay!",
      "createdAt": "2025-08-01T12:00:00Z",
      "user": { "id": "uuid", "name": "Alice", "image": "https://..." },
      "booking": {
        "id": "uuid",
        "checkIn": "2025-07-01",
        "checkOut": "2025-07-05",
        "guests": 2
      }
    }
  ],
  "homestay": {
    "id": "uuid",
    "name": "Cozy Cottage"
  },
  "stats": {
    "totalReviews": 42,
    "averageRating": 4.6,
    "ratingDistribution": [
      { "rating": 5, "count": 30 },
      { "rating": 4, "count": 8 },
      { "rating": 3, "count": 3 },
      { "rating": 2, "count": 1 },
      { "rating": 1, "count": 0 }
    ]
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalCount": 42,
    "hasNextPage": true,
    "hasPrevPage": false,
    "limit": 20
  }
}
```

**Error Codes:**

* `400 Bad Request` – homestay ID missing
* `404 Not Found` – homestay not found
* `500 Internal Server Error`

---

### `POST /api/reviews/[homestayId]`

Create a review for a homestay. Requires an authenticated user and a completed booking.

**Request JSON:**

```json
{
  "rating": 5,
  "comment": "Fantastic stay, highly recommended!",
  "bookingId": "uuid"
}
```

**Response (201):**

```json
{
  "message": "Review created successfully!",
  "review": {
    "id": "uuid",
    "rating": 5,
    "comment": "Fantastic stay, highly recommended!",
    "user": { "id": "uuid", "name": "Alice", "image": "https://..." },
    "booking": {
      "id": "uuid",
      "checkIn": "2025-07-01",
      "checkOut": "2025-07-05",
      "guests": 2
    }
  }
}
```

**Validation Rules:**

* `rating` must be an integer between 1–5
* `comment` optional but if present: 10–1000 characters
* `bookingId` must be a valid UUID

**Error Codes:**

* `400 Bad Request` – invalid payload, booking/homestay mismatch, booking not completed, or review already exists
* `401 Unauthorized` – not logged in
* `403 Forbidden` – trying to review someone else’s booking
* `404 Not Found` – homestay or booking not found
* `500 Internal Server Error`


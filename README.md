
# **Ride Booking System API**

A role-based, scalable, and secure backend API for a ride booking system (like Uber/Pathao) built with **Express.js**, **TypeScript**, and **Mongoose**.

Supports **Riders**, **Drivers**, and **Admin** roles with ride management, earnings tracking, and geo-based ride search.

---

## **Features**

### **Authentication & Authorization**

* JWT-based login system
* Roles: **Admin**, **Rider**, **Driver**
* Secure password hashing with **bcrypt**
* Role-based route protection (middleware)

### **Rider Features**

* Request a ride with **pickup & destination** locations
* Cancel a ride (if not yet accepted)
* View personal ride history

### **Driver Features**

* View nearby ride requests (Geo-based search using `$near`)
* Accept ride requests
* Update ride status (**Picked Up → In Transit → Completed**)
* View earnings & completed ride history
* Set availability status (online/offline)

### **Admin Features**

* View all users, drivers, and rides
* Approve/Suspend drivers
* Block/Unblock user accounts
* Generate reports (optional)

---

## **Ride Lifecycle**

A ride passes through these statuses:

```
REQUESTED → ACCEPTED → PICKED_UP → IN_TRANSIT → COMPLETED / CANCELED
```

Timestamps are stored for each transition:

* `requestedAt`, `acceptedAt`, `pickedUpAt`, `completedAt`, `canceledAt`

---

## **Tech Stack**

* **Backend:** Node.js, Express.js, TypeScript
* **Database:** MongoDB with Mongoose
* **Authentication:** JWT + bcrypt
* **Geo Queries:** MongoDB 2dsphere Index
* **Validation:** Mongoose schema validation
* **Error Handling:** Centralized AppError handler

---

## **Installation & Setup**

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-repo/ride-booking-api.git
   cd ride-booking-api
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Setup environment variables (.env):**

   ```env
   PORT=5000
   DATABASE_URL=mongodb://localhost:27017/RideShare
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   BCRYPT_SALT=10
   ```

4. **Run the server:**

   ```bash
   npm run dev
   ```

---

## **Database Models**

### **User**

```ts
{
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: "admin" | "rider" | "driver";
  isActive: boolean;
  isBlocked: boolean;
  isApproved?: boolean; // For drivers
  currentLocation?: { type: "Point"; coordinates: [number, number] };
  vehicleInfo?: { model: string; plateNumber: string; color: string };
  totalEarnings: number;
}
```

### **Ride**

```ts
{
  rider: ObjectId (User);
  driver?: ObjectId (User);
  pickupLocation: { type: "Point"; address: string; coordinates: [number, number] };
  destinationLocation: { type: "Point"; address: string; coordinates: [number, number] };
  fare: number;
  status: "requested" | "accepted" | "picked_up" | "in_transit" | "completed" | "canceled";
  cancellationReason?: string;
  timestamps: {
    requestedAt?: Date;
    acceptedAt?: Date;
    pickedUpAt?: Date;
    completedAt?: Date;
    canceledAt?: Date;
  };
}
```

---

## **API Endpoints**

### **Auth**

* `POST /auth/register` – Register user (rider/driver)
* `POST /auth/login` – Login & get JWT

### **Rider**

* `POST /rides/request` – Request a ride
* `PATCH /rides/:id/cancel` – Cancel a ride
* `GET /rides/me` – View my rides

### **Driver**

* `GET /rides/nearby` – Get nearby rides
* `PATCH /rides/:id/accept` – Accept a ride
* `PATCH /rides/:id/status` – Update ride status
* `GET /drivers/earnings` – View earnings

### **Admin**

* `GET /users` – View all users
* `PATCH /drivers/:id/approve` – Approve driver
* `PATCH /users/:id/block` – Block user
* `GET /rides` – View all rides

---

## **Geo Queries**

* **2dsphere Index** for `pickupLocation.coordinates` & `destinationLocation.coordinates`
* `$near` query used to find rides within a radius:

```ts
Ride.find({
  status: "requested",
  "pickupLocation.coordinates": {
    $near: { $geometry: { type: "Point", coordinates: [lng, lat] }, $maxDistance: 50000 }
  }
});
```

---

## **Error Handling**

Centralized error handler with custom `AppError` class:

* 400 – Bad request
* 403 – Forbidden
* 404 – Not found
* 500 – Server error

---

## **Future Enhancements**

* Real-time ride updates
* Dynamic fare calculation
* Driver rating & feedback
* Admin analytics dashboard

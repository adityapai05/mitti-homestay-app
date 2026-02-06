/* prisma/seed.ts */

import {
  PrismaClient,
  Role,
  Category,
  Type,
  BookingStatus,
  RefundStatus,
  PaymentStatus,
  CancellationActor,
  CancellationPolicy,
} from "@prisma/client";

const prisma = new PrismaClient();

const daysAgo = (n: number): Date =>
  new Date(Date.now() - n * 24 * 60 * 60 * 1000);

/* ---------------------------------------------------
   GEOGRAPHIC CLUSTERS (REAL LOCATIONS)
--------------------------------------------------- */

const REGIONS = [
  {
    village: "Kudle",
    district: "Uttara Kannada",
    state: "Karnataka",
    pincode: "581326",
    lat: 14.5479,
    lng: 74.3188,
  },
  {
    village: "Agumbe",
    district: "Udupi",
    state: "Karnataka",
    pincode: "576112",
    lat: 13.5088,
    lng: 75.0904,
  },
  {
    village: "Mandrem",
    district: "North Goa",
    state: "Goa",
    pincode: "403527",
    lat: 15.6653,
    lng: 73.704,
  },
  {
    village: "Kalga",
    district: "Kullu",
    state: "Himachal Pradesh",
    pincode: "175105",
    lat: 32.0145,
    lng: 77.3256,
  },
  {
    village: "Bhimtal",
    district: "Nainital",
    state: "Uttarakhand",
    pincode: "263136",
    lat: 29.3445,
    lng: 79.5631,
  },
];

/* ---------------------------------------------------
   HOMESTAY BLUEPRINTS (NO CLONES)
--------------------------------------------------- */

const GLOBAL_IMAGE_POOL = [
    "https://images.unsplash.com/photo-1680239179048-f7bbf6cd19ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlsbGFnZSUyMGhvdXNlfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1595521624992-48a59aef95e3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dmlsbGFnZSUyMGhvdXNlfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1604601638406-edc29b54dcf7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHZpbGxhZ2UlMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1663145034225-069d4eada7ee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHZpbGxhZ2UlMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1621439920794-f455dadc19a8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHZpbGxhZ2UlMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1720789983681-a5fbb1925cad?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHZpbGxhZ2UlMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1667552750502-eef567beadf5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHZpbGxhZ2UlMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1667552750442-3b33eb38e00f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dmlsbGFnZSUyMGhvdXNlfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1593579329655-d4ebec1d4c94?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dmlsbGFnZSUyMGhvdXNlfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1647771167457-c82f4850bb7e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG9tZXN0YXl8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1696217612904-64c78f5c588a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG9tZXN0YXl8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1636598283264-664035b8d4e1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG9tZXN0YXl8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1706628416807-7994b12d64f8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvbWVzdGF5fGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1651478880955-38850da0870d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGhvbWVzdGF5fGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1762246434363-6691884249a1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cnVyYWwlMjBob21lJTIwaW50ZXJpb3J8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1574931697692-f937f1a4134f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHV0fGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1627547999744-b84d3ea26ad8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aHV0fGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1468939071598-4e7b02c34a9f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGh1dHxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1543125274-403616012d4f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGh1dHxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1611262360544-af37696056b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aHV0fGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1728025893964-77af2ef241eb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZvcmVzdCUyMGh1dHxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1553969536-25af5d502f24?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGZvcmVzdCUyMGh1dHxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1664970907664-aa047bd15b9f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y290dGFnZSUyMGluZGlhbnxlbnwwfHwwfHx8MA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1699537318832-4f059f96b9dc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Y290dGFnZSUyMGluZGlhbnxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1647771167457-c82f4850bb7e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNvdHRhZ2UlMjBpbmRpYW58ZW58MHx8MHx8fDA%3D"
];

function pickImages(baseImages: string[]): string[] {
  const images = new Set<string>(baseImages);

  while (images.size < 5 + Math.floor(Math.random() * 3)) {
    const extra =
      GLOBAL_IMAGE_POOL[Math.floor(Math.random() * GLOBAL_IMAGE_POOL.length)];
    images.add(extra);
  }

  return Array.from(images);
}

const BLUEPRINTS = [
  {
    base: "Coconut Grove Farm Stay",
    category: Category.FARM_STAY,
    type: Type.HOME,
    amenities: ["Home Food", "WiFi", "Parking", "Garden", "Hot Water"],
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      "https://images.unsplash.com/photo-1599423300746-b62533397364",
      "https://images.unsplash.com/photo-1605276373954-0c4a0dac5b12",
    ],
  },
  {
    base: "Riverbend Eco Lodge",
    category: Category.ECO_LODGE,
    type: Type.ROOM,
    amenities: ["River View", "Solar Power", "Breakfast", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      "https://images.unsplash.com/photo-1501117716987-c8e1ecb210ad",
    ],
  },
  {
    base: "Heritage Courtyard Home",
    category: Category.TRADITIONAL_HOME,
    type: Type.HOME,
    amenities: ["Courtyard", "Home Food", "WiFi", "Hot Water"],
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
    ],
  },
  {
    base: "Hillview Retreat",
    category: Category.MOUNTAIN_RETREAT,
    type: Type.ROOM,
    amenities: ["Mountain View", "Fireplace", "WiFi"],
    images: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    ],
  },
  {
    base: "Lakeside Haven",
    category: Category.LAKESIDE,
    type: Type.HOME,
    amenities: ["Lake View", "Kayaking", "WiFi", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d91",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c",
    ],
  },
];

/* ---------------------------------------------------
   VERBOSE REVIEW POOL
--------------------------------------------------- */

const REVIEW_TEXT = [
  "We came here expecting a quiet stay and left with a deep sense of calm. The hosts were warm, attentive without being intrusive, and the food tasted like it was made with genuine care.",
  "The property is exactly as described. Clean rooms, thoughtful details, and a location that makes you forget the city exists.",
  "If you are looking for luxury, this is not it. If you are looking for authenticity, this is perfect.",
  "Every morning began with birds and mist, and every evening ended with conversations we did not plan to have.",
  "One of those rare stays where the place stays with you long after you leave.",
  "The road is a bit rough near the end, but the destination is absolutely worth it.",
  "We extended our stay by two nights because leaving felt premature.",
];

/* ---------------------------------------------------
   MAIN SEED
--------------------------------------------------- */

async function main() {
  console.log("Generating large-scale realistic MITTI data");

  const users = await prisma.user.findMany();
  const hosts = users.filter((u) => u.role === Role.HOST);
  const guests = users.filter((u) => u.role === Role.USER);

  if (!hosts.length || !guests.length) {
    throw new Error("HOST and USER accounts are required");
  }

  for (const host of hosts) {
    const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];
    const homestayCount = 4 + Math.floor(Math.random() * 3);

    for (let i = 0; i < homestayCount; i++) {
      const blueprint =
        BLUEPRINTS[(i + Math.floor(Math.random() * 10)) % BLUEPRINTS.length];

      const homestay = await prisma.homestay.create({
        data: {
          ownerId: host.id,
          name: `${blueprint.base} ${i + 1}`,
          description: `
This homestay is built around the idea that travel should slow you down.
There are no schedules forced upon guests, no activities you must attend.

Days unfold naturally here. Some guests explore nearby villages, others read,
walk, cook, or simply sit and listen to the environment around them.

It is best suited for travelers who value silence, honesty, and human connection.
          `.trim(),
          village: region.village,
          district: region.district,
          state: region.state,
          pincode: region.pincode,
          latitude: region.lat + Math.random() * 0.008,
          longitude: region.lng + Math.random() * 0.008,
          pricePerNight: 1400 + Math.floor(Math.random() * 2600),
          beds: 1 + Math.floor(Math.random() * 3),
          bedrooms: 1 + Math.floor(Math.random() * 2),
          bathrooms: 1 + Math.floor(Math.random() * 2),
          maxGuests: 2 + Math.floor(Math.random() * 4),
          type: blueprint.type,
          category: blueprint.category,
          amenities: blueprint.amenities,
          imageUrl: pickImages(blueprint.images),
          guideAvailable: Math.random() > 0.5,
          guideFee: 500 + Math.floor(Math.random() * 600),
          cancellationPolicy:
            Object.values(CancellationPolicy)[Math.floor(Math.random() * 3)],
          isVerified: true,
          createdAt: daysAgo(300 - i * 25),
        },
      });

      let ratingSum = 0;
      let ratingCount = 0;

      const bookingCount = 18 + Math.floor(Math.random() * 25);

      for (let b = 0; b < bookingCount; b++) {
        const guest = guests[Math.floor(Math.random() * guests.length)];
        const completed = Math.random() > 0.25;

        const booking = await prisma.booking.create({
          data: {
            userId: guest.id,
            homestayId: homestay.id,
            checkIn: daysAgo(220 - b * 6),
            checkOut: daysAgo(217 - b * 6),
            guests: 1 + Math.floor(Math.random() * 3),
            totalPrice: Number(homestay.pricePerNight) * 3,
            status: completed
              ? BookingStatus.COMPLETED
              : BookingStatus.CANCELLED_BY_GUEST,
            cancelledBy: completed ? null : CancellationActor.GUEST,
            refundAmount: completed ? null : Number(homestay.pricePerNight),
            refundStatus: completed
              ? RefundStatus.NOT_APPLICABLE
              : RefundStatus.PROCESSED,
            createdAt: daysAgo(225 - b * 6),
          },
        });

        await prisma.payment.create({
          data: {
            bookingId: booking.id,
            razorpayOrderId: `order_${booking.id.slice(0, 8)}`,
            razorpayPaymentId: `pay_${booking.id.slice(0, 8)}`,
            razorpaySignature: "demo",
            amount: booking.totalPrice,
            currency: "INR",
            status: completed ? PaymentStatus.SUCCESS : PaymentStatus.REFUNDED,
          },
        });

        if (completed) {
          const rating = 3 + Math.floor(Math.random() * 3);
          ratingSum += rating;
          ratingCount++;

          await prisma.review.create({
            data: {
              userId: guest.id,
              homestayId: homestay.id,
              bookingId: booking.id,
              rating,
              comment:
                REVIEW_TEXT[Math.floor(Math.random() * REVIEW_TEXT.length)],
            },
          });
        }
      }

      await prisma.homestay.update({
        where: { id: homestay.id },
        data: { rating: Number((ratingSum / ratingCount).toFixed(1)) },
      });
    }
  }

  console.log("MITTI data generation complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

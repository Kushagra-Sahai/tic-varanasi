import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

// Licensed stock photography placeholders — swap via the admin media picker
// once real fleet/property photography is available.
const img = (seed: string, w = 1200, h = 800) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

async function main() {
  console.log("Seeding TIC database...");

  // ── Admin user ──────────────────────────────────────────────────────
  const adminPasswordHash = await bcrypt.hash("Admin@TIC2026", 10);
  await db.user.upsert({
    where: { email: "ticvns@gmail.com" },
    update: {},
    create: {
      email: "ticvns@gmail.com",
      name: "TIC Admin",
      role: "admin",
      passwordHash: adminPasswordHash,
    },
  });

  // ── Vehicle categories ──────────────────────────────────────────────
  const categoryDefs = [
    { name: "Sedan", slug: "sedan", description: "Comfortable city & outstation sedans", sortOrder: 1 },
    { name: "SUV", slug: "suv", description: "Spacious SUVs for families and hills", sortOrder: 2 },
    { name: "Ertiga", slug: "ertiga", description: "6-seater MPV, ideal for small groups", sortOrder: 3 },
    { name: "Innova", slug: "innova", description: "Toyota Innova — 7-seater comfort", sortOrder: 4 },
    { name: "Innova Crysta", slug: "innova-crysta", description: "Premium 7-seater with extra legroom", sortOrder: 5 },
    { name: "Tempo Traveller", slug: "tempo-traveller", description: "12–17 seater for groups", sortOrder: 6 },
    { name: "Luxury Sedan", slug: "luxury-sedan", description: "Executive class sedans", sortOrder: 7 },
    { name: "Luxury SUV", slug: "luxury-suv", description: "Top-tier SUVs for VIP travel", sortOrder: 8 },
    { name: "Mini Bus", slug: "mini-bus", description: "25–30 seater for larger groups", sortOrder: 9 },
    { name: "Coach Bus", slug: "coach-bus", description: "40+ seater luxury coaches", sortOrder: 10 },
    { name: "Electric Vehicle", slug: "electric-vehicle", description: "Eco-friendly EV fleet", sortOrder: 11 },
  ];

  const categories: Record<string, string> = {};
  for (const c of categoryDefs) {
    const cat = await db.vehicleCategory.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    categories[c.slug] = cat.id;
  }

  // ── Vehicles ─────────────────────────────────────────────────────────
  const vehicleDefs = [
    {
      slug: "swift-dzire",
      name: "Swift Dzire",
      category: "sedan",
      capacity: 4,
      luggageCapacity: 2,
      basePrice: 800,
      pricePerKm: 12,
      driverAllowance: 300,
      nightCharge: 250,
      description:
        "A comfortable, fuel-efficient sedan perfect for Varanasi darshan, Sarnath day trips and short outstation runs.",
      features: ["Air Conditioning", "Music System", "Clean Upholstery", "GPS Tracking"],
      isFeatured: true,
    },
    {
      slug: "toyota-etios",
      name: "Toyota Etios",
      category: "sedan",
      capacity: 4,
      luggageCapacity: 3,
      basePrice: 900,
      pricePerKm: 13,
      driverAllowance: 300,
      nightCharge: 250,
      description: "Spacious boot and a smooth ride — a favourite for airport transfers and city sightseeing.",
      features: ["Air Conditioning", "Extra Legroom", "Phone Charger", "First Aid Kit"],
    },
    {
      slug: "maruti-ertiga",
      name: "Maruti Ertiga",
      category: "ertiga",
      capacity: 6,
      luggageCapacity: 4,
      basePrice: 1400,
      pricePerKm: 15,
      driverAllowance: 350,
      nightCharge: 300,
      description: "6-seater MPV ideal for small families visiting Kashi Vishwanath, Assi Ghat and Sarnath together.",
      features: ["Air Conditioning", "Third Row Seating", "Ample Luggage Space", "Music System"],
      isFeatured: true,
    },
    {
      slug: "toyota-innova",
      name: "Toyota Innova",
      category: "innova",
      capacity: 7,
      luggageCapacity: 5,
      basePrice: 1800,
      pricePerKm: 17,
      driverAllowance: 400,
      nightCharge: 350,
      description: "The trusted 7-seater workhorse for multi-day pilgrimage circuits — Varanasi to Ayodhya to Prayagraj.",
      features: ["Air Conditioning", "Captain Seats", "High Ground Clearance", "GPS Tracking"],
    },
    {
      slug: "innova-crysta",
      name: "Innova Crysta",
      category: "innova-crysta",
      capacity: 7,
      luggageCapacity: 5,
      basePrice: 2400,
      pricePerKm: 20,
      driverAllowance: 450,
      nightCharge: 400,
      description: "Premium 7-seater with leather seats and extra refinement — preferred by corporate and VIP guests.",
      features: ["Leather Seats", "Rear AC Vents", "Premium Sound System", "Reclining Seats"],
      isFeatured: true,
    },
    {
      slug: "tempo-traveller-12",
      name: "Tempo Traveller (12 Seater)",
      category: "tempo-traveller",
      capacity: 12,
      luggageCapacity: 10,
      basePrice: 3200,
      pricePerKm: 24,
      driverAllowance: 500,
      nightCharge: 450,
      description: "Ideal for group pilgrimage tours and family reunions across Kashi, Sarnath and Vindhyachal.",
      features: ["Push-back Seats", "Air Conditioning", "Reading Lights", "Luggage Carrier"],
    },
    {
      slug: "mercedes-e-class",
      name: "Mercedes-Benz E-Class",
      category: "luxury-sedan",
      capacity: 3,
      luggageCapacity: 2,
      basePrice: 6000,
      pricePerKm: 45,
      driverAllowance: 800,
      nightCharge: 800,
      description: "Chauffeur-driven luxury sedan for VIP airport transfers and executive corporate travel.",
      features: ["Chauffeur in Uniform", "Premium Leather Interior", "Complimentary Water", "Wi-Fi Onboard"],
      isFeatured: true,
    },
    {
      slug: "toyota-fortuner",
      name: "Toyota Fortuner",
      category: "luxury-suv",
      capacity: 6,
      luggageCapacity: 4,
      basePrice: 5500,
      pricePerKm: 40,
      driverAllowance: 700,
      nightCharge: 700,
      description: "Commanding presence and comfort — for VIP darshan visits and premium family travel.",
      features: ["4x4 Capability", "Premium Interior", "Sunroof", "Advanced Safety Suite"],
    },
    {
      slug: "coach-bus-45",
      name: "Luxury Coach (45 Seater)",
      category: "coach-bus",
      capacity: 45,
      luggageCapacity: 30,
      basePrice: 9000,
      pricePerKm: 60,
      driverAllowance: 1000,
      nightCharge: 1000,
      description: "Full-size luxury coach for large pilgrimage groups, corporate offsites and wedding parties.",
      features: ["Reclining Seats", "Onboard Restroom", "PA System", "Entertainment Screen"],
    },
    {
      slug: "tata-nexon-ev",
      name: "Tata Nexon EV",
      category: "electric-vehicle",
      capacity: 4,
      luggageCapacity: 2,
      basePrice: 1200,
      pricePerKm: 10,
      driverAllowance: 300,
      nightCharge: 250,
      description: "Zero-emission city rides — a quiet, modern option for Varanasi sightseeing.",
      features: ["Zero Emission", "Air Conditioning", "Touchscreen Infotainment", "Fast Charging Support"],
      isFeatured: true,
    },
  ];

  for (const v of vehicleDefs) {
    const vehicle = await db.vehicle.upsert({
      where: { slug: v.slug },
      update: {},
      create: {
        slug: v.slug,
        name: v.name,
        categoryId: categories[v.category],
        capacity: v.capacity,
        luggageCapacity: v.luggageCapacity,
        basePrice: v.basePrice,
        pricePerKm: v.pricePerKm,
        driverAllowance: v.driverAllowance,
        nightCharge: v.nightCharge,
        description: v.description,
        isFeatured: v.isFeatured ?? false,
        images: {
          create: [0, 1, 2].map((i) => ({
            url: img(`${v.slug}-${i}`),
            alt: `${v.name} — TIC Varanasi`,
            sortOrder: i,
            isPrimary: i === 0,
          })),
        },
        features: { create: v.features.map((label) => ({ label })) },
      },
    });
    void vehicle;
  }

  // ── Destinations ─────────────────────────────────────────────────────
  const destinationDefs = [
    { slug: "varanasi", name: "Varanasi", summary: "The eternal city on the banks of the Ganga.", history: "One of the oldest continuously inhabited cities in the world, sacred to Hindus, Jains and Buddhists alike.", bestSeason: "October to March" },
    { slug: "sarnath", name: "Sarnath", summary: "Where Buddha delivered his first sermon.", history: "A major Buddhist pilgrimage site 10km from Varanasi, home to the Dhamek Stupa.", bestSeason: "October to March" },
    { slug: "ayodhya", name: "Ayodhya", summary: "Birthplace of Lord Rama and home to the Ram Mandir.", history: "One of the seven most sacred cities in Hinduism, on the banks of the Sarayu river.", bestSeason: "October to March" },
    { slug: "prayagraj", name: "Prayagraj", summary: "Sangam of the Ganga, Yamuna and mythical Saraswati.", history: "Site of the Kumbh Mela, one of the largest religious gatherings on Earth.", bestSeason: "October to March" },
  ];
  for (const d of destinationDefs) {
    await db.destination.upsert({ where: { slug: d.slug }, update: {}, create: d });
  }

  // ── Tour packages ────────────────────────────────────────────────────
  const packageDefs = [
    {
      slug: "kashi-vishwanath-darshan",
      title: "Kashi Vishwanath Darshan & Ganga Aarti",
      summary: "A 2-day spiritual immersion covering the Kashi Vishwanath temple, Dashashwamedh Ghat Aarti and boat ride.",
      description:
        "Experience the soul of Varanasi with VIP darshan at the Kashi Vishwanath Dham, a sunrise boat ride along the ghats, and the mesmerising Ganga Aarti at Dashashwamedh Ghat. Includes a guided walk through the old city lanes.",
      durationDays: 2,
      durationNights: 1,
      price: 6500,
      discountPrice: 5499,
      isFeatured: true,
      itinerary: [
        { title: "Arrival & Ganga Aarti", details: "Airport/station pickup, hotel check-in, evening Ganga Aarti at Dashashwamedh Ghat." },
        { title: "Kashi Vishwanath Darshan & Departure", details: "Early morning boat ride, VIP darshan at Kashi Vishwanath Dham, old city walk, drop-off." },
      ],
      inclusions: ["AC vehicle for all transfers", "1 night hotel stay", "VIP darshan assistance", "English/Hindi speaking guide"],
      exclusions: ["Personal expenses", "Temple donations", "Meals not specified"],
    },
    {
      slug: "varanasi-sarnath-day-tour",
      title: "Varanasi & Sarnath Day Tour",
      summary: "A full-day circuit covering Varanasi's ghats and the Buddhist heritage of Sarnath.",
      description:
        "Visit the major ghats of Varanasi, the Kashi Vishwanath temple, and travel onward to Sarnath to see the Dhamek Stupa and Archaeological Museum — all in a single comfortable day.",
      durationDays: 1,
      durationNights: 0,
      price: 3200,
      isFeatured: true,
      itinerary: [
        { title: "Full Day Circuit", details: "Morning ghat visit, Kashi Vishwanath darshan, lunch break, Sarnath sightseeing, evening drop." },
      ],
      inclusions: ["AC vehicle", "Guide", "Bottled water"],
      exclusions: ["Lunch", "Entry tickets"],
    },
    {
      slug: "ayodhya-ram-mandir-tour",
      title: "Ayodhya Ram Mandir Pilgrimage",
      summary: "A 2-day trip from Varanasi to the Ram Mandir and sacred sites of Ayodhya.",
      description:
        "Travel comfortably from Varanasi to Ayodhya for darshan at the Ram Mandir, Hanuman Garhi and Kanak Bhawan, with an overnight stay and a relaxed return journey.",
      durationDays: 2,
      durationNights: 1,
      price: 8500,
      discountPrice: 7499,
      itinerary: [
        { title: "Varanasi to Ayodhya", details: "Early departure, arrival and check-in, evening Sarayu aarti." },
        { title: "Ram Mandir Darshan & Return", details: "Morning darshan at Ram Mandir, Hanuman Garhi, Kanak Bhawan, drive back to Varanasi." },
      ],
      inclusions: ["AC vehicle", "1 night hotel", "Toll & parking", "Driver allowance"],
      exclusions: ["Meals", "Personal expenses"],
    },
    {
      slug: "prayagraj-sangam-tour",
      title: "Prayagraj Sangam Day Trip",
      summary: "A day trip to the sacred confluence of three rivers at Prayagraj.",
      description:
        "Visit the Triveni Sangam, Anand Bhawan and the historic Allahabad Fort on a comfortable day trip from Varanasi.",
      durationDays: 1,
      durationNights: 0,
      price: 3800,
      itinerary: [
        { title: "Sangam Day Trip", details: "Morning departure, Sangam boat ride, Anand Bhawan, evening return to Varanasi." },
      ],
      inclusions: ["AC vehicle", "Boat ride at Sangam"],
      exclusions: ["Meals", "Guide"],
    },
    {
      slug: "spiritual-circuit-4-cities",
      title: "Spiritual Circuit: Varanasi–Ayodhya–Prayagraj–Sarnath",
      summary: "A comprehensive 5-day pilgrimage covering all four major sacred sites.",
      description:
        "Our signature multi-day circuit connecting Kashi, Ayodhya, Prayagraj and Sarnath with comfortable overnight stays, private AC transport and experienced guides throughout.",
      durationDays: 5,
      durationNights: 4,
      price: 22000,
      discountPrice: 18999,
      isFeatured: true,
      itinerary: [
        { title: "Arrival in Varanasi", details: "Check-in, evening Ganga Aarti." },
        { title: "Varanasi & Sarnath", details: "Kashi Vishwanath darshan, Sarnath sightseeing." },
        { title: "Varanasi to Ayodhya", details: "Drive to Ayodhya, Ram Mandir darshan." },
        { title: "Ayodhya to Prayagraj", details: "Drive to Prayagraj, Sangam visit." },
        { title: "Prayagraj to Varanasi & Departure", details: "Return drive, drop-off." },
      ],
      inclusions: ["AC vehicle for full circuit", "4 nights hotel", "Daily breakfast", "Dedicated guide"],
      exclusions: ["Lunch & dinner", "Temple donations", "Personal expenses"],
    },
  ];

  for (const p of packageDefs) {
    await db.package.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        title: p.title,
        summary: p.summary,
        description: p.description,
        durationDays: p.durationDays,
        durationNights: p.durationNights,
        price: p.price,
        discountPrice: p.discountPrice,
        isFeatured: p.isFeatured ?? false,
        images: {
          create: [0, 1, 2].map((i) => ({
            url: img(`${p.slug}-${i}`),
            alt: p.title,
            sortOrder: i,
            isPrimary: i === 0,
          })),
        },
        itinerary: {
          create: p.itinerary.map((day, i) => ({
            dayNumber: i + 1,
            title: day.title,
            details: day.details,
          })),
        },
        inclusions: { create: p.inclusions.map((label) => ({ label })) },
        exclusions: { create: p.exclusions.map((label) => ({ label })) },
      },
    });
  }

  // ── Testimonials ─────────────────────────────────────────────────────
  const testimonialDefs = [
    { name: "Rajesh & Family", location: "Delhi", message: "TIC made our Kashi Vishwanath darshan effortless. The driver was courteous and the car was spotless. Highly recommend for family pilgrimage trips.", rating: 5, isFeatured: true },
    { name: "Priya Sharma", location: "Mumbai", message: "Booked the Ayodhya package for my parents — TIC handled everything from pickup to hotel to darshan assistance. Excellent service.", rating: 5, isFeatured: true },
    { name: "James Carter", location: "United Kingdom", message: "As a foreign tourist, I felt completely safe and well guided throughout Varanasi. The Ganga Aarti boat ride was unforgettable.", rating: 5, isFeatured: true },
    { name: "Anita Verma", location: "Lucknow", message: "Corporate airport transfer was punctual and professional every single time. Our go-to travel partner in Varanasi now.", rating: 4, isFeatured: false },
  ];
  for (const t of testimonialDefs) {
    const existing = await db.testimonial.findFirst({ where: { name: t.name } });
    if (!existing) await db.testimonial.create({ data: t });
  }

  // ── FAQs ─────────────────────────────────────────────────────────────
  const faqDefs = [
    { category: "booking", question: "How do I book a vehicle or tour package?", answer: "You can book directly on our website via the Book Now button, call us at 9795903030, or message us on WhatsApp. We confirm every booking with a unique Booking ID." },
    { category: "booking", question: "Do I need to pay in advance?", answer: "A small advance may be requested to confirm outstation trips and multi-day packages; local city rides can usually be paid on completion." },
    { category: "vehicles", question: "Are your drivers experienced with pilgrimage routes?", answer: "Yes — all our drivers are local, background-verified, and experienced with Varanasi, Sarnath, Ayodhya and Prayagraj routes." },
    { category: "general", question: "Do you provide 24x7 support?", answer: "Yes, our support team is available 24x7 by phone and WhatsApp for any assistance during your trip." },
  ];
  for (const f of faqDefs) {
    const existing = await db.faq.findFirst({ where: { question: f.question } });
    if (!existing) await db.faq.create({ data: f });
  }

  // ── Settings ─────────────────────────────────────────────────────────
  const settingsDefs: Record<string, string> = {
    site_phone_primary: "9795903030",
    site_phone_secondary: "8081947598",
    site_landline: "0542-4543026",
    site_email: "ticvns@gmail.com",
    site_whatsapp: "919795903030",
    site_address: "Varanasi, Uttar Pradesh, India",
    years_in_service: "25",
  };
  for (const [key, value] of Object.entries(settingsDefs)) {
    await db.setting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

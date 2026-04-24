import { randomUUID } from 'node:crypto'
import type { Property } from '~/types/property'
import type { User } from '~/types/user'
import { getStorage } from '~/server/utils/storage'
import { hashPassword } from '~/server/utils/auth'

// Stable Unsplash photo IDs — these are permanent and don't require API keys
const img = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

const SEED_PROPERTIES: Omit<Property, 'id' | 'userRef' | 'createdAt' | 'updatedAt'>[] =
  [
    {
      title: 'Skyline Penthouse with Panoramic Views',
      type: 'sale',
      status: 'active',
      description:
        'Perched on the 42nd floor, this full-floor penthouse redefines luxury living in the heart of Manhattan. Floor-to-ceiling windows frame the city skyline from every room. The open-plan kitchen features Calacatta marble countertops, Sub-Zero appliances, and a waterfall island that seats six. The primary suite occupies the entire east wing with a spa bath, steam shower, and a dressing room you\'ll actually want to spend time in.',
      bedrooms: 3,
      bathrooms: 3,
      parking: true,
      furnished: true,
      amenities: ['Concierge', 'Rooftop terrace', 'Private elevator', 'Wine cellar', 'Home automation'],
      address: '432 Park Avenue, Floor 42',
      city: 'New York',
      state: 'NY',
      lat: 40.7614,
      lng: -73.9776,
      regularPrice: 1_950_000,
      offer: false,
      images: [
        img('1545324418-5e0b26d52a45'),
        img('1600607687939-ce8a6c25118c'),
        img('1556909114-f6e7ad7d3136'),
        img('1560448204-603b3fc33ddc'),
      ],
    },
    {
      title: 'Beachfront Villa — Private Pool & Dock',
      type: 'sale',
      status: 'active',
      description:
        'Wake up to the sound of the ocean in this extraordinary beachfront villa on Miami\'s Biscayne Bay. The property spans 6,200 sq ft across two stories, with walls of glass that dissolve the boundary between indoors and out. A resort-style pool wraps around the back patio, and a private dock can accommodate a 50-foot yacht. The chef\'s kitchen is equipped with Wolf and Miele appliances throughout.',
      bedrooms: 5,
      bathrooms: 4,
      parking: true,
      furnished: true,
      amenities: ['Private beach', 'Heated pool', 'Private dock', 'Outdoor kitchen', 'Smart home'],
      address: '1 Ocean Drive',
      city: 'Miami Beach',
      state: 'FL',
      lat: 25.7907,
      lng: -80.1300,
      regularPrice: 3_200_000,
      discountedPrice: 2_950_000,
      offer: true,
      images: [
        img('1580587771525-78b9dba3b914'),
        img('1564013799919-ab600027ffc6'),
        img('1582268611958-ebfd161ef9cf'),
        img('1600585154340-be6161a56a0c'),
      ],
    },
    {
      title: 'The Fulton Loft — Industrial Chic in River North',
      type: 'rent',
      status: 'active',
      description:
        'A masterclass in adaptive reuse, this 2,100 sq ft converted warehouse loft blends exposed brick, Douglas fir beams, and polished concrete with high-spec modern finishes. Twelve-foot ceilings and oversized steel-frame windows flood the open-plan living space with north light. The kitchen features a ten-burner La Cornue range. Includes two dedicated garage spaces below.',
      bedrooms: 2,
      bathrooms: 2,
      parking: true,
      furnished: false,
      amenities: ['Rooftop deck', 'Bike storage', 'Package room', 'EV charging'],
      address: '210 N Peoria St',
      city: 'Chicago',
      state: 'IL',
      lat: 41.8856,
      lng: -87.6495,
      regularPrice: 4_200,
      offer: false,
      images: [
        img('1567496898669-ee935f5f647a'),
        img('1522708323590-d24dbb6b0267'),
        img('1493809842364-78817add7ffb'),
        img('1574362848149-11496d93a7c7'),
      ],
    },
    {
      title: 'Highland Oaks Estate — 1 Acre of Texas Hill Country',
      type: 'sale',
      status: 'active',
      description:
        'Built in 2021, this four-bedroom home sits on a private acre backing onto a protected greenbelt. The great room is anchored by a 20-foot shiplap fireplace wall, while the kitchen opens to a covered patio with an outdoor kitchen and fire pit. The primary suite is on the main floor with a soaking tub and direct access to the back deck. Three-car garage and dedicated office above.',
      bedrooms: 4,
      bathrooms: 3,
      parking: true,
      furnished: false,
      amenities: ['Greenbelt access', 'Outdoor kitchen', 'Fire pit', 'Home office', 'Solar panels'],
      address: '4812 Lost Creek Blvd',
      city: 'Austin',
      state: 'TX',
      lat: 30.2970,
      lng: -97.8040,
      regularPrice: 720_000,
      offer: false,
      images: [
        img('1568605114967-8130f3a36994'),
        img('1512917774080-9991f1c4c750'),
        img('1600047509807-ba8f99d2cdde'),
        img('1484154218962-a197022b5858'),
      ],
    },
    {
      title: 'Pacific Heights Flat with Golden Gate Views',
      type: 'rent',
      status: 'active',
      description:
        'Top-floor flat in a classic Edwardian building in one of SF\'s most sought-after neighborhoods. Freshly renovated with period details preserved — decorative fireplaces, hardwood floors, and bay windows overlooking the rooftops toward the bay. The modern kitchen has Caesarstone counters and Fisher & Paykel appliances. Communal roof deck has Golden Gate views.',
      bedrooms: 2,
      bathrooms: 1,
      parking: true,
      furnished: false,
      amenities: ['Roof deck', 'In-unit laundry', 'Period features', 'Bike storage'],
      address: '2840 Broadway St',
      city: 'San Francisco',
      state: 'CA',
      lat: 37.7946,
      lng: -122.4477,
      regularPrice: 5_500,
      offer: false,
      images: [
        img('1558618666-fcd25c85cd64'),
        img('1571939228382-b2f2b585ce15'),
        img('1554995207-c18c203602cb'),
        img('1416331108676-a22ccb276e35'),
      ],
    },
    {
      title: 'South End Brownstone — Architect Renovated',
      type: 'sale',
      status: 'active',
      description:
        'A fully gut-renovated 1890s brownstone spread across four levels, designed by a Boston-based architecture firm. The original facade and stoop are meticulously preserved while the interior is entirely new construction. The chef\'s kitchen at the garden level opens to a private patio and landscaped garden. The top floor primary suite has a private terrace. Walk to everything.',
      bedrooms: 3,
      bathrooms: 3,
      parking: false,
      furnished: false,
      amenities: ['Private garden', 'Private terrace', 'Radiant heat', 'Historic details', 'Smart home'],
      address: '417 Tremont Street',
      city: 'Boston',
      state: 'MA',
      lat: 42.3445,
      lng: -71.0693,
      regularPrice: 1_350_000,
      offer: false,
      images: [
        img('1576941089067-2de3c901e126'),
        img('1600566753086-00f18fb6b3ea'),
        img('1560448204-603b3fc33ddc'),
        img('1493809842364-78817add7ffb'),
      ],
    },
    {
      title: 'Capitol Hill Townhouse — New Construction',
      type: 'rent',
      status: 'active',
      description:
        'Brand new 2024 townhouse on a quiet tree-lined street in Capitol Hill, one block from the light rail. Three levels of thoughtfully designed living space with a rooftop deck that catches Olympic Mountain sunsets. The kitchen features a waterfall quartz island with seating for four. Private attached garage with EV charger included.',
      bedrooms: 3,
      bathrooms: 3,
      parking: true,
      furnished: false,
      amenities: ['Rooftop deck', 'EV charger', 'Private garage', 'New construction'],
      address: '1506 E Pike Street',
      city: 'Seattle',
      state: 'WA',
      lat: 47.6144,
      lng: -122.3108,
      regularPrice: 3_400,
      offer: false,
      images: [
        img('1564013799919-ab600027ffc6'),
        img('1600607687939-ce8a6c25118c'),
        img('1484154218962-a197022b5858'),
        img('1522708323590-d24dbb6b0267'),
      ],
    },
    {
      title: 'Willamette River Retreat — Waterfront',
      type: 'sale',
      status: 'active',
      description:
        'One of the last privately owned waterfront parcels in inner Portland, this contemporary three-bedroom sits directly on the Willamette with a private dock and 180-degree river views. The living and dining room form one fluid space, bookended by a glass fireplace and a 12-foot accordion door to the riverside deck. Clad in western red cedar with a sedum roof.',
      bedrooms: 3,
      bathrooms: 2,
      parking: true,
      furnished: false,
      amenities: ['Private dock', 'River views', 'Sedum roof', 'Fire feature', 'Cedar cladding'],
      address: '5824 SW Corbett Ave',
      city: 'Portland',
      state: 'OR',
      lat: 45.4904,
      lng: -122.6770,
      regularPrice: 875_000,
      offer: false,
      images: [
        img('1580587771525-78b9dba3b914'),
        img('1582268611958-ebfd161ef9cf'),
        img('1512917774080-9991f1c4c750'),
        img('1568605114967-8130f3a36994'),
      ],
    },
    {
      title: 'Silver Lake Studio — Walk to the Reservoir',
      type: 'rent',
      status: 'active',
      description:
        'A beautifully designed studio in a 1930s Spanish Colonial building, recently renovated to combine original character with modern convenience. Arched doorways, terracotta floors, and a wood-burning fireplace. The kitchen has been completely updated with Bertazzoni range and open shelving. Shared courtyard with fig tree and outdoor seating. Three-minute walk to the Silver Lake Reservoir loop.',
      bedrooms: 0,
      bathrooms: 1,
      parking: true,
      furnished: true,
      amenities: ['Fireplace', 'Courtyard', 'Laundry on-site', 'Bike storage'],
      address: '2621 Glendale Blvd',
      city: 'Los Angeles',
      state: 'CA',
      lat: 34.0901,
      lng: -118.2698,
      regularPrice: 3_000,
      discountedPrice: 2_600,
      offer: true,
      images: [
        img('1554995207-c18c203602cb'),
        img('1493809842364-78817add7ffb'),
        img('1522708323590-d24dbb6b0267'),
        img('1416331108676-a22ccb276e35'),
      ],
    },
    {
      title: 'Music Row Compound — Recording Studio Included',
      type: 'sale',
      status: 'active',
      description:
        'A rare opportunity in Nashville\'s most creative neighborhood — a 5,800 sq ft main residence plus a fully equipped 1,200 sq ft professional recording studio on a gated 1.2-acre lot. The main house was extensively renovated in 2022 with a great room, pool terrace, and full outdoor kitchen. The studio is ProTools-equipped with a live room, isolation booth, and control room.',
      bedrooms: 5,
      bathrooms: 5,
      parking: true,
      furnished: true,
      amenities: ['Recording studio', 'Pool', 'Gated estate', 'Outdoor kitchen', 'Guest house'],
      address: '1015 16th Ave S',
      city: 'Nashville',
      state: 'TN',
      lat: 36.1469,
      lng: -86.7975,
      regularPrice: 2_100_000,
      offer: false,
      images: [
        img('1600585154340-be6161a56a0c'),
        img('1545324418-5e0b26d52a45'),
        img('1564013799919-ab600027ffc6'),
        img('1582268611958-ebfd161ef9cf'),
      ],
    },
    {
      title: 'Sloan\'s Lake Bungalow — Mountain Views',
      type: 'rent',
      status: 'active',
      description:
        'A lovingly maintained 1940s bungalow two blocks from Sloan\'s Lake park, with unobstructed views of the Front Range from the back yard. Original hardwood floors, a claw-foot tub, and a wood-burning fireplace are paired with a fully updated kitchen and bath. The detached garage has been converted to a yoga/office studio. The private back garden gets full afternoon sun.',
      bedrooms: 3,
      bathrooms: 2,
      parking: true,
      furnished: false,
      amenities: ['Mountain views', 'Detached studio', 'Private garden', 'Fireplace'],
      address: '2455 W 26th Ave',
      city: 'Denver',
      state: 'CO',
      lat: 39.7539,
      lng: -105.0330,
      regularPrice: 4_200,
      discountedPrice: 3_800,
      offer: true,
      images: [
        img('1600047509807-ba8f99d2cdde'),
        img('1568605114967-8130f3a36994'),
        img('1560448204-603b3fc33ddc'),
        img('1574362848149-11496d93a7c7'),
      ],
    },
    {
      title: 'North Park Craftsman — Steps to 30th Street',
      type: 'sale',
      status: 'active',
      description:
        'A fully restored 1924 Craftsman bungalow in the heart of North Park, San Diego\'s most walkable neighborhood. Original built-ins, box-beam ceilings, and a tiled fireplace surround have been preserved alongside a completely new kitchen, bathrooms, and systems. The back yard has been landscaped with drought-tolerant natives and a lemon grove. ADU potential in the oversized lot.',
      bedrooms: 3,
      bathrooms: 2,
      parking: true,
      furnished: false,
      amenities: ['Original craftsman details', 'Drought-tolerant garden', 'ADU potential', 'Alley access'],
      address: '3812 Ohio St',
      city: 'San Diego',
      state: 'CA',
      lat: 32.7447,
      lng: -117.1292,
      regularPrice: 1_350_000,
      discountedPrice: 1_100_000,
      offer: true,
      images: [
        img('1512917774080-9991f1c4c750'),
        img('1576941089067-2de3c901e126'),
        img('1484154218962-a197022b5858'),
        img('1600566753086-00f18fb6b3ea'),
      ],
    },
  ]

export default defineNitroPlugin(async () => {
  const { listings, users } = getStorage()

  if (listings.size > 0) return // already seeded

  // ── Seed demo users ───────────────────────────────────────────────────────
  const demoUsers: User[] = [
    {
      id: 'user-demo-1',
      name: 'Alex Morgan',
      email: 'demo@propertyhub.com',
      passwordHash: hashPassword('demo1234'),
      favourites: [],
      createdAt: new Date('2024-01-15').toISOString(),
    },
    {
      id: 'user-demo-2',
      name: 'Jordan Lee',
      email: 'agent@propertyhub.com',
      passwordHash: hashPassword('agent1234'),
      favourites: [],
      createdAt: new Date('2024-02-01').toISOString(),
    },
  ]

  for (const u of demoUsers) users.set(u.id, u)

  // ── Seed listings ─────────────────────────────────────────────────────────
  const ownerIds = ['user-demo-1', 'user-demo-2']
  const now = new Date()

  SEED_PROPERTIES.forEach((p, i) => {
    const id = `prop-${String(i + 1).padStart(3, '0')}`
    const createdAt = new Date(now.getTime() - i * 3 * 24 * 60 * 60 * 1000).toISOString()
    listings.set(id, {
      ...p,
      id,
      userRef: ownerIds[i % 2] as string,
      createdAt,
      updatedAt: createdAt,
    })
  })

  console.log(
    `[Property Hub] Seeded ${listings.size} listings and ${users.size} users.`,
  )
})

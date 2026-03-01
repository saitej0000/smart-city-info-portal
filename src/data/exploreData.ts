import { UtensilsCrossed, Landmark, Hotel, HeartPulse, GraduationCap, Church } from 'lucide-react';

export interface Place {
    name: string;
    address: string;
    rating: number;
}

export interface Category {
    title: string;
    slug: string;
    description: string;
    icon: any;
    iconColor: string;
    iconBg: string;
    places: Place[];
}

export const categories: Category[] = [
    {
        title: 'Dining & Entertainment',
        slug: 'dining',
        description: 'Find top-rated restaurants, cafes, and entertainment venues across Telangana.',
        icon: UtensilsCrossed,
        iconColor: 'text-red-500',
        iconBg: 'bg-red-50',
        places: [
            // Hyderabad - Biryani & Mughlai
            { name: 'Paradise Biryani', address: 'MG Road, Secunderabad', rating: 4.7 },
            { name: 'Bawarchi Restaurant', address: 'RTC Cross Roads, Hyderabad', rating: 4.6 },
            { name: 'Shah Ghouse', address: 'Tolichowki, Hyderabad', rating: 4.5 },
            { name: 'Pista House', address: 'Charminar Road, Hyderabad', rating: 4.5 },
            { name: 'Hotel Nayaab', address: 'Charminar, Hyderabad', rating: 4.4 },
            { name: 'Shadab Restaurant', address: 'Madina Circle, Hyderabad', rating: 4.5 },
            { name: 'Cafe Bahar', address: 'Basheer Bagh, Hyderabad', rating: 4.3 },
            { name: 'Sarvi Restaurant', address: 'Banjara Hills, Hyderabad', rating: 4.2 },
            { name: 'Lucky Restaurant', address: 'Narayanguda, Hyderabad', rating: 4.1 },
            { name: 'Hyderabad House', address: 'Madhapur, Hyderabad', rating: 4.3 },
            { name: 'Astoria Hotel', address: 'Abids, Hyderabad', rating: 4.0 },
            { name: 'Rumaan Restaurant', address: 'Tolichowki, Hyderabad', rating: 4.3 },
            // Hyderabad - Fine Dining
            { name: 'Golconda Pavilion', address: 'ITC Kohenur, Hitec City', rating: 5.0 },
            { name: 'Dakshin', address: 'ITC Kakatiya, Begumpet', rating: 4.9 },
            { name: 'Jewel of Nizam', address: 'The Golconda Hotel, Masab Tank', rating: 4.5 },
            { name: 'Firdaus', address: 'Taj Krishna, Banjara Hills', rating: 4.8 },
            { name: 'Peshawar', address: 'ITC Kohenur, Hitec City', rating: 4.5 },
            { name: 'Ottimo', address: 'ITC Kohenur, Hitec City', rating: 4.6 },
            { name: 'Aqua', address: 'Park Hyatt, Banjara Hills', rating: 4.7 },
            // Hyderabad - Casual & Chains
            { name: 'AB\'s - Absolute Barbecues', address: 'Jubilee Hills, Hyderabad', rating: 4.6 },
            { name: 'Barbeque Nation', address: 'Punjagutta, Hyderabad', rating: 4.3 },
            { name: 'Cream Stone', address: 'Banjara Hills, Hyderabad', rating: 4.4 },
            { name: 'Ohri\'s Jiva Imperia', address: 'Banjara Hills, Hyderabad', rating: 4.3 },
            { name: 'Chutneys', address: 'Road No. 1, Banjara Hills', rating: 4.4 },
            { name: 'Flechazo', address: 'Jubilee Hills, Hyderabad', rating: 4.6 },
            { name: 'Over The Moon', address: 'Jubilee Hills, Hyderabad', rating: 4.5 },
            { name: 'Tatva', address: 'Kondapur, Hyderabad', rating: 4.3 },
            { name: 'Ohri\'s Tansen', address: 'Basheer Bagh, Hyderabad', rating: 4.2 },
            { name: 'Rayalaseema Ruchulu', address: 'Madhapur, Hyderabad', rating: 4.2 },
            { name: 'Subbayya Gari Hotel', address: 'Ameerpet, Hyderabad', rating: 4.5 },
            { name: 'Simply South', address: 'Gachibowli, Hyderabad', rating: 4.2 },
            { name: 'Mehfil Restaurant', address: 'Basheer Bagh, Hyderabad', rating: 4.3 },
            { name: 'Spicy Venue', address: 'Jubilee Hills, Hyderabad', rating: 4.2 },
            { name: 'Kritunga Restaurant', address: 'Madhapur, Hyderabad', rating: 4.1 },
            { name: 'Ulavacharu', address: 'Jubilee Hills, Hyderabad', rating: 4.4 },
            { name: 'Minerva Coffee Shop', address: 'Himayat Nagar, Hyderabad', rating: 4.1 },
            { name: 'Zara\'s Bakery', address: 'Tolichowki, Hyderabad', rating: 4.3 },
            { name: 'Karachi Bakery', address: 'Mozamjahi Market, Hyderabad', rating: 4.5 },
            { name: 'Almond House', address: 'Banjara Hills, Hyderabad', rating: 4.4 },
            // Hyderabad - Cafes
            { name: 'Roastery Coffee House', address: 'Jubilee Hills, Hyderabad', rating: 4.5 },
            { name: 'Autumn Leaf Cafe', address: 'Jubilee Hills, Hyderabad', rating: 4.4 },
            { name: 'The Hole in the Wall Cafe', address: 'Begumpet, Hyderabad', rating: 4.3 },
            { name: 'Concu', address: 'Banjara Hills, Hyderabad', rating: 4.5 },
            { name: 'Blue Fox Hotel', address: 'MG Road, Secunderabad', rating: 4.0 },
            // Hyderabad - Street Food
            { name: 'Ram Ki Bandi', address: 'Charminar, Hyderabad', rating: 4.6 },
            { name: 'Nimrah Cafe', address: 'Charminar, Hyderabad', rating: 4.5 },
            { name: 'Govind Dosa', address: 'Charminar, Hyderabad', rating: 4.2 },
            { name: 'Gokul Chat', address: 'Koti, Hyderabad', rating: 4.3 },
            { name: 'Agra Sweets', address: 'Dilsukhnagar, Hyderabad', rating: 4.0 },
            // Entertainment - Hyderabad
            { name: 'Prasads IMAX', address: 'NTR Marg, Hyderabad', rating: 4.5 },
            { name: 'AMB Cinemas', address: 'Gachibowli, Hyderabad', rating: 4.7 },
            { name: 'Asian Cinemas', address: 'Uppal, Hyderabad', rating: 4.2 },
            { name: 'Wonderla Amusement Park', address: 'Rangareddy, Hyderabad', rating: 4.3 },
            { name: 'Escape Rooms', address: 'Jubilee Hills, Hyderabad', rating: 4.1 },
            // Warangal
            { name: 'Mehfil Restaurant', address: 'Hanamkonda, Warangal', rating: 4.3 },
            { name: 'Sri Sai Ram Parlour', address: 'Kazipet, Warangal', rating: 4.1 },
            { name: 'Hotel Ratna', address: 'JPN Road, Warangal', rating: 4.0 },
            { name: 'Grand Hotel', address: 'Bus Stand Area, Warangal', rating: 3.9 },
            { name: 'Surya Mahal', address: 'Hanamkonda, Warangal', rating: 4.0 },
            // Karimnagar
            { name: 'Hotel Suprabhat', address: 'Karimnagar Main Road', rating: 4.2 },
            { name: 'Minerva Grand', address: 'Mankammathota, Karimnagar', rating: 4.1 },
            { name: 'Sri Sai Krishna Restaurant', address: 'Karimnagar Town', rating: 4.0 },
            { name: 'Dine Hill', address: 'Vidyanagar, Karimnagar', rating: 3.9 },
            // Nizamabad
            { name: 'Hotel Sai Surya', address: 'Hyderabad Road, Nizamabad', rating: 4.0 },
            { name: 'Sri Venkateswara Hotel', address: 'Bus Stand Road, Nizamabad', rating: 3.9 },
            { name: 'Aditya Restaurant', address: 'Nizamabad Town', rating: 3.8 },
            // Khammam
            { name: 'Hotel Sai Pooja', address: 'Wyra Road, Khammam', rating: 4.0 },
            { name: 'Sri Lakshmi Ganapathi', address: 'Bus Stand Area, Khammam', rating: 3.9 },
            { name: 'Grand Spice', address: 'Gandhi Chowk, Khammam', rating: 3.8 },
            // Nalgonda
            { name: 'Sri Sai Deluxe Hotel', address: 'Hyderabad Road, Nalgonda', rating: 3.8 },
            { name: 'Annapurna Restaurant', address: 'Nalgonda Town', rating: 3.7 },
            // Mahbubnagar
            { name: 'Hotel Sri Sai', address: 'Bus Stand Road, Mahbubnagar', rating: 3.9 },
            { name: 'Royal Treat', address: 'Mahbubnagar Town', rating: 3.8 },
            // Adilabad
            { name: 'Hotel Saptagiri', address: 'Station Road, Adilabad', rating: 3.8 },
            { name: 'Kinnera Hotel', address: 'Adilabad Town', rating: 3.7 },
            // Siddipet
            { name: 'Ulavacharu Restaurant', address: 'Main Road, Siddipet', rating: 4.0 },
            { name: 'Sri Sai Tiffins', address: 'Bus Stand, Siddipet', rating: 3.9 },
            // Mancherial
            { name: 'Hotel Viceroy', address: 'Mancherial Town', rating: 3.8 },
            // Ramagundam
            { name: 'Hotel Grand', address: 'Ramagundam, Peddapalli', rating: 3.8 },
            // Suryapet
            { name: 'Hotel Haritha', address: 'Suryapet Town', rating: 3.7 },
            // Miryalaguda
            { name: 'Sri Venkateshwara Bhavan', address: 'Miryalaguda, Nalgonda', rating: 3.8 },
            // Bodhan
            { name: 'New Andhra Meals', address: 'Bodhan, Nizamabad', rating: 3.7 },
        ],
    },
    {
        title: 'Tourist Attractions',
        slug: 'tourist',
        description: 'Explore historical sites, parks, waterfalls, and famous landmarks across all 33 districts of Telangana.',
        icon: Landmark,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-50',
        places: [
            // Hyderabad - Monuments
            { name: 'Charminar', address: 'Char Kaman, Ghansi Bazaar, Hyderabad', rating: 4.5 },
            { name: 'Golconda Fort', address: 'Ibrahim Bagh, Hyderabad', rating: 4.6 },
            { name: 'Chowmahalla Palace', address: 'Motigalli, Hyderabad', rating: 4.6 },
            { name: 'Qutb Shahi Tombs', address: 'Ibrahim Bagh, Hyderabad', rating: 4.4 },
            { name: 'Paigah Tombs', address: 'Pisal Banda, Hyderabad', rating: 4.5 },
            { name: 'Falaknuma Palace', address: 'Engine Bowli, Hyderabad', rating: 4.8 },
            { name: 'Mecca Masjid', address: 'Near Charminar, Hyderabad', rating: 4.6 },
            { name: 'Taramati Baradari', address: 'Ibrahim Bagh, Hyderabad', rating: 4.3 },
            { name: 'Purani Haveli', address: 'Nayapul, Hyderabad', rating: 4.1 },
            { name: 'British Residency', address: 'Koti, Hyderabad', rating: 4.2 },
            { name: 'Laad Bazaar', address: 'Near Charminar, Hyderabad', rating: 4.3 },
            { name: 'Salar Jung Museum', address: 'Dar-ul-Shifa, Hyderabad', rating: 4.7 },
            { name: 'Telangana State Museum', address: 'Public Gardens, Hyderabad', rating: 4.3 },
            { name: 'Birla Science Museum', address: 'Naubat Pahad, Hyderabad', rating: 4.4 },
            { name: 'Nizam\'s Museum', address: 'Purani Haveli, Hyderabad', rating: 4.2 },
            // Hyderabad - Parks & Lakes
            { name: 'Hussain Sagar Lake', address: 'Tank Bund, Hyderabad', rating: 4.5 },
            { name: 'KBR National Park', address: 'Jubilee Hills, Hyderabad', rating: 4.4 },
            { name: 'Nehru Zoological Park', address: 'Bahadurpura, Hyderabad', rating: 4.3 },
            { name: 'Lumbini Park', address: 'Opposite Secretariat, Hyderabad', rating: 4.2 },
            { name: 'NTR Gardens', address: 'Tank Bund Road, Hyderabad', rating: 4.3 },
            { name: 'Durgam Cheruvu', address: 'Hitec City, Hyderabad', rating: 4.4 },
            { name: 'Osman Sagar Lake', address: 'Gandipet, Hyderabad', rating: 4.2 },
            { name: 'Himayat Sagar', address: 'Hyderabad Outskirts', rating: 4.1 },
            { name: 'Shamirpet Lake', address: 'Shamirpet, Medchal', rating: 4.1 },
            { name: 'Botanical Garden', address: 'Kondapur, Hyderabad', rating: 4.2 },
            { name: 'Mrugavani National Park', address: 'Chilkur, Hyderabad', rating: 4.0 },
            { name: 'Mahavir Harina Vanasthali', address: 'Vanasthalipuram, Hyderabad', rating: 4.0 },
            // Hyderabad - Entertainment
            { name: 'Ramoji Film City', address: 'Abdullapurmet, Hyderabad', rating: 4.4 },
            { name: 'Snow World', address: 'Lower Tank Bund, Hyderabad', rating: 4.1 },
            { name: 'Shilparamam', address: 'Hitec City, Madhapur', rating: 4.3 },
            { name: 'Sudha Cars Museum', address: 'Bahadurpura, Hyderabad', rating: 4.2 },
            // Warangal District
            { name: 'Warangal Fort', address: 'Warangal City', rating: 4.3 },
            { name: 'Thousand Pillar Temple', address: 'Hanamkonda, Warangal', rating: 4.5 },
            { name: 'Ramappa Temple (UNESCO)', address: 'Palampet, Mulugu', rating: 4.8 },
            { name: 'Bhadrakali Temple & Lake', address: 'Bhadrakali, Warangal', rating: 4.5 },
            { name: 'Kakatiya Musical Garden', address: 'Hanamkonda, Warangal', rating: 4.0 },
            { name: 'Kakatiya Rock Garden', address: 'Warangal', rating: 3.9 },
            { name: 'Padmakshi Temple', address: 'Hanamkonda, Warangal', rating: 4.2 },
            { name: 'Kakatiya Gateway (Kakatiya Kala Thoranam)', address: 'Warangal', rating: 4.4 },
            // Mulugu District
            { name: 'Laknavaram Lake', address: 'Govindaraopet, Mulugu', rating: 4.5 },
            { name: 'Eturnagaram Wildlife Sanctuary', address: 'Mulugu', rating: 4.2 },
            { name: 'Tadvai Forest Area', address: 'Mulugu', rating: 4.3 },
            { name: 'Bogatha Waterfalls', address: 'Khammam-Mulugu Border', rating: 4.4 },
            { name: 'Pakhal Lake', address: 'Pakhal, Warangal Rural', rating: 4.1 },
            // Nalgonda District
            { name: 'Nagarjuna Sagar Dam', address: 'Nalgonda District', rating: 4.4 },
            { name: 'Nagarjunakonda Island Museum', address: 'Nagarjuna Sagar', rating: 4.3 },
            { name: 'Ethipothala Waterfalls', address: 'Near Nagarjuna Sagar', rating: 4.2 },
            { name: 'Panagal Canal', address: 'Nalgonda', rating: 3.9 },
            // Yadadri Bhuvanagiri
            { name: 'Yadadri Lakshmi Narasimha Temple', address: 'Yadagirigutta', rating: 4.8 },
            { name: 'Bhongir Fort', address: 'Bhongir', rating: 4.3 },
            { name: 'Pochampally Village (IKAT Heritage)', address: 'Pochampally', rating: 4.2 },
            { name: 'Kolanupaka Jain Temple', address: 'Kolanupaka', rating: 4.1 },
            // Medak District
            { name: 'Medak Cathedral', address: 'Medak Town', rating: 4.6 },
            { name: 'Medak Fort', address: 'Medak Town', rating: 4.1 },
            { name: 'Edupayala Vana Durga Temple', address: 'Medak', rating: 4.3 },
            // Sangareddy
            { name: 'Anantagiri Hills', address: 'Vikarabad, Sangareddy', rating: 4.5 },
            { name: 'Ananthagiri Temple', address: 'Vikarabad', rating: 4.3 },
            { name: 'Fort Sangareddy', address: 'Sangareddy Town', rating: 3.8 },
            { name: 'Manjira Wildlife Sanctuary', address: 'Sangareddy', rating: 4.0 },
            // Adilabad District
            { name: 'Kuntala Waterfalls', address: 'Neredigonda, Adilabad', rating: 4.5 },
            { name: 'Pochera Waterfalls', address: 'Khanapur, Nirmal', rating: 4.3 },
            { name: 'Kawal Tiger Reserve', address: 'Jannaram, Mancherial', rating: 4.4 },
            { name: 'Gayathri Waterfalls', address: 'Adilabad Town', rating: 4.2 },
            { name: 'Pranahita Wildlife Sanctuary', address: 'Mancherial', rating: 4.0 },
            // Nirmal
            { name: 'Basar Saraswati Temple', address: 'Basar, Nirmal', rating: 4.6 },
            { name: 'Nirmal Fort', address: 'Nirmal Town', rating: 3.9 },
            { name: 'Nirmal Paintings Gallery', address: 'Nirmal Town', rating: 4.0 },
            // Nizamabad
            { name: 'Nizamabad Fort', address: 'Nizamabad Town', rating: 4.0 },
            { name: 'Ashok Sagar Lake', address: 'Nizamabad', rating: 4.1 },
            { name: 'Alisagar', address: 'Near Nizamabad', rating: 4.0 },
            { name: 'Kanteshwar Temple', address: 'Nizamabad', rating: 4.2 },
            { name: 'Sahajahani Begum Botanical Garden', address: 'Nizamabad', rating: 3.9 },
            // Karimnagar
            { name: 'Elgandal Fort', address: 'Karimnagar', rating: 4.1 },
            { name: 'Lower Manair Dam', address: 'Karimnagar', rating: 4.2 },
            { name: 'Kothapally Anjaneya Temple', address: 'Karimnagar', rating: 4.0 },
            // Jagtial
            { name: 'Dharmapuri Lakshmi Narasimha Temple', address: 'Dharmapuri, Jagtial', rating: 4.4 },
            { name: 'Kondagattu Anjaneya Swamy Temple', address: 'Kondagattu, Jagtial', rating: 4.3 },
            // Rajanna Sircilla
            { name: 'Vemulawada Rajanna Temple', address: 'Vemulawada', rating: 4.7 },
            // Khammam
            { name: 'Khammam Fort', address: 'Khammam Town', rating: 4.0 },
            { name: 'Kinnerasani Dam', address: 'Paloncha, Khammam', rating: 4.2 },
            { name: 'Kinnerasani Wildlife Sanctuary', address: 'Khammam', rating: 4.1 },
            // Bhadradri Kothagudem
            { name: 'Bhadrachalam Temple', address: 'Bhadrachalam', rating: 4.7 },
            { name: 'Parnashala', address: 'Near Bhadrachalam', rating: 4.2 },
            { name: 'Papikondalu Hills', address: 'Godavari, Bhadradri', rating: 4.6 },
            // Mahbubnagar
            { name: 'Pillalamarri Banyan Tree', address: 'Mahbubnagar Town', rating: 4.1 },
            { name: 'Koilsagar Dam', address: 'Mahbubnagar', rating: 4.0 },
            { name: 'Gadwal Fort', address: 'Gadwal, Jogulamba Gadwal', rating: 4.0 },
            { name: 'Jurala Dam', address: 'Gadwal', rating: 4.2 },
            // Jogulamba Gadwal
            { name: 'Alampur Jogulamba Temple', address: 'Alampur', rating: 4.5 },
            { name: 'Navabrahma Temples', address: 'Alampur', rating: 4.3 },
            // Wanaparthy
            { name: 'Wanaparthy Palace', address: 'Wanaparthy Town', rating: 4.0 },
            // Nagarkurnool
            { name: 'Somasila Dam', address: 'Nagarkurnool', rating: 4.1 },
            { name: 'Kollapur Sri Uma Maheshwara Temple', address: 'Nagarkurnool', rating: 4.2 },
            // Jayashankar Bhupalpally
            { name: 'Kaleshwaram Mukteshwara Temple', address: 'Kaleshwaram', rating: 4.6 },
            { name: 'Mallur Waterfalls', address: 'Bhupalpally', rating: 4.0 },
            // Siddipet
            { name: 'Komurelly Mallanna Temple', address: 'Siddipet', rating: 4.3 },
            // Suryapet
            { name: 'Mattapally Temple', address: 'Suryapet', rating: 3.8 },
            { name: 'Pillalamarri Archeswara Temple', address: 'Suryapet', rating: 4.1 },
            // Peddapalli
            { name: 'Ramagundam Thermal Park', address: 'Ramagundam', rating: 3.9 },
            // Medchal-Malkajgiri
            { name: 'Keesaragutta Temple', address: 'Keesara', rating: 4.3 },
        ],
    },
    {
        title: 'Accommodations',
        slug: 'accommodations',
        description: 'Locate luxury hotels, resorts, and comfortable stays across Telangana.',
        icon: Hotel,
        iconColor: 'text-purple-500',
        iconBg: 'bg-purple-50',
        places: [
            // Hyderabad - 5 Star Luxury
            { name: 'Taj Falaknuma Palace', address: 'Engine Bowli, Falaknuma', rating: 5.0 },
            { name: 'Park Hyatt Hyderabad', address: 'Banjara Hills', rating: 4.8 },
            { name: 'ITC Kohenur', address: 'Hitec City', rating: 4.8 },
            { name: 'Taj Krishna', address: 'Banjara Hills', rating: 4.7 },
            { name: 'ITC Kakatiya', address: 'Begumpet', rating: 4.6 },
            { name: 'Marriott Hotel & Convention Centre', address: 'Tank Bund Road', rating: 4.7 },
            { name: 'JW Marriott Hyderabad', address: 'Hitec City', rating: 4.6 },
            { name: 'Westin Hyderabad Mindspace', address: 'Hitec City', rating: 4.6 },
            // Hyderabad - 4 Star
            { name: 'Trident Hyderabad', address: 'Hitec City, Madhapur', rating: 4.6 },
            { name: 'Novotel Hyderabad', address: 'Convention Centre Road, Hitec City', rating: 4.5 },
            { name: 'The Park Hyderabad', address: 'Somajiguda', rating: 4.5 },
            { name: 'Radisson Blu Plaza', address: 'Banjara Hills', rating: 4.4 },
            { name: 'Taj Deccan', address: 'Banjara Hills', rating: 4.5 },
            { name: 'Courtyard by Marriott', address: 'Hitec City', rating: 4.4 },
            { name: 'Sheraton Hyderabad', address: 'Gachibowli', rating: 4.5 },
            { name: 'Avasa Hotel', address: 'Hitec City', rating: 4.4 },
            { name: 'Mercure Hyderabad KCP', address: 'Banjara Hills', rating: 4.3 },
            { name: 'Holiday Inn Express', address: 'Hitec City', rating: 4.2 },
            // Hyderabad - 3 Star & Budget
            { name: 'Lemon Tree Premier', address: 'Hitec City', rating: 4.3 },
            { name: 'Hotel Minerva Grand', address: 'Secunderabad', rating: 4.1 },
            { name: 'Royalton Hotel', address: 'Chirag Ali Lane, Abids', rating: 4.0 },
            { name: 'The Golconda Hotel', address: 'Masab Tank', rating: 4.2 },
            { name: 'Aditya Park Hotel', address: 'Ameerpet', rating: 4.0 },
            { name: 'Treebo Trend Icon', address: 'Madhapur', rating: 3.8 },
            { name: 'FabHotel', address: 'Gachibowli', rating: 3.7 },
            // Hyderabad - Near Airport
            { name: 'Novotel Hyderabad Airport', address: 'Shamshabad', rating: 4.4 },
            { name: 'ITC Kohenur (HICC)', address: 'Hitec City', rating: 4.7 },
            // Resorts - Near Hyderabad
            { name: 'Leonia Holistic Destination', address: 'Shameerpet', rating: 4.1 },
            { name: 'Tara Comfort Hotel (RFC)', address: 'Ramoji Film City', rating: 4.2 },
            { name: 'Pragathi Resorts', address: 'Thumkunta, Shamirpet', rating: 4.0 },
            { name: 'Green Park Resort', address: 'Vikarabad', rating: 3.9 },
            // Warangal
            { name: 'Haritha Hotel Warangal', address: 'Kazipet, Warangal', rating: 3.8 },
            { name: 'Hotel Ashoka', address: 'Hanamkonda, Warangal', rating: 3.9 },
            { name: 'Grand Hotel Warangal', address: 'Warangal Town', rating: 3.7 },
            { name: 'Hotel Sri Sai Grand', address: 'JPN Road, Warangal', rating: 3.8 },
            // Karimnagar
            { name: 'Hotel Minerva Grand', address: 'Karimnagar Town', rating: 4.0 },
            { name: 'Haritha Hotel Karimnagar', address: 'Karimnagar', rating: 3.7 },
            // Nizamabad
            { name: 'Hotel Kakatiya Residency', address: 'Nizamabad', rating: 3.8 },
            { name: 'Hotel Sapphire', address: 'Nizamabad Town', rating: 3.6 },
            // Khammam
            { name: 'Hotel Sai Suites', address: 'Khammam', rating: 3.7 },
            // Mahbubnagar
            { name: 'Hotel Sri Sai International', address: 'Mahbubnagar', rating: 3.6 },
            // Adilabad
            { name: 'Hotel Saptagiri', address: 'Adilabad', rating: 3.5 },
            // Bhadrachalam
            { name: 'Haritha Hotel Bhadrachalam', address: 'Bhadrachalam', rating: 3.8 },
            // Nagarjuna Sagar
            { name: 'Haritha Vijay Vihar Resort', address: 'Nagarjuna Sagar', rating: 4.0 },
            // Srisailam
            { name: 'Haritha Hotel Srisailam', address: 'Srisailam', rating: 3.9 },
        ],
    },
    {
        title: 'Healthcare Facilities',
        slug: 'healthcare',
        description: 'Access top-tier hospitals, specialty centers, and clinics across Telangana.',
        icon: HeartPulse,
        iconColor: 'text-rose-500',
        iconBg: 'bg-rose-50',
        places: [
            // Hyderabad - Private Multi-specialty
            { name: 'Apollo Hospitals', address: 'Jubilee Hills, Hyderabad', rating: 4.8 },
            { name: 'KIMS Hospitals', address: 'Minister Road, Secunderabad', rating: 4.6 },
            { name: 'Yashoda Hospitals (Somajiguda)', address: 'Somajiguda, Hyderabad', rating: 4.5 },
            { name: 'Yashoda Hospitals (Malakpet)', address: 'Malakpet, Hyderabad', rating: 4.4 },
            { name: 'Yashoda Hospitals (Secunderabad)', address: 'Secunderabad', rating: 4.5 },
            { name: 'Care Hospitals (Banjara Hills)', address: 'Banjara Hills, Hyderabad', rating: 4.6 },
            { name: 'Care Hospitals (Hitec City)', address: 'Hitec City, Hyderabad', rating: 4.4 },
            { name: 'Star Hospitals', address: 'Gachibowli, Hyderabad', rating: 4.7 },
            { name: 'Continental Hospitals', address: 'Gachibowli, Hyderabad', rating: 4.4 },
            { name: 'Global Hospitals', address: 'Lakdikapul, Hyderabad', rating: 4.5 },
            { name: 'Sunshine Hospitals', address: 'Secunderabad', rating: 4.4 },
            { name: 'AIG Hospitals', address: 'Gachibowli, Hyderabad', rating: 4.5 },
            { name: 'MaxCure Hospitals', address: 'Madhapur, Hyderabad', rating: 4.3 },
            { name: 'Medicover Hospitals', address: 'Hitec City, Hyderabad', rating: 4.3 },
            { name: 'Citizens Specialty Hospital', address: 'Serilingampally', rating: 4.2 },
            { name: 'Ozone Hospitals', address: 'Kukatpally, Hyderabad', rating: 4.1 },
            { name: 'Virinchi Hospitals', address: 'Banjara Hills, Hyderabad', rating: 4.2 },
            { name: 'TX Hospitals', address: 'Kachiguda, Hyderabad', rating: 4.0 },
            { name: 'OMNI Hospitals', address: 'Kukatpally, Hyderabad', rating: 4.0 },
            // Hyderabad - Government
            { name: 'NIMS', address: 'Panjagutta, Hyderabad', rating: 4.3 },
            { name: 'Osmania General Hospital', address: 'Afzalgunj, Hyderabad', rating: 4.0 },
            { name: 'Gandhi Hospital', address: 'Musheerabad, Hyderabad', rating: 4.1 },
            { name: 'Niloufer Hospital', address: 'Red Hills, Hyderabad', rating: 4.0 },
            { name: 'TIMS Gachibowli', address: 'Gachibowli, Hyderabad', rating: 4.2 },
            { name: 'King Koti Hospital', address: 'Koti, Hyderabad', rating: 3.9 },
            { name: 'Chest Hospital Erragadda', address: 'Erragadda, Hyderabad', rating: 3.8 },
            { name: 'Fever Hospital', address: 'Nallakunta, Hyderabad', rating: 3.8 },
            // Hyderabad - Specialty
            { name: 'LV Prasad Eye Institute', address: 'Banjara Hills', rating: 4.8 },
            { name: 'Basavatarakam Cancer Hospital', address: 'Banjara Hills', rating: 4.6 },
            { name: 'MNJ Cancer Hospital', address: 'Lakdikapul', rating: 4.1 },
            { name: 'KIMS ICON Heart Centre', address: 'Kondapur', rating: 4.5 },
            { name: 'Fernandez Hospital', address: 'Bogulkunta, Hyderabad', rating: 4.4 },
            { name: 'Rainbow Children\'s Hospital', address: 'Banjara Hills', rating: 4.5 },
            { name: 'Aware Gleneagles Hospital', address: 'LB Nagar, Hyderabad', rating: 4.2 },
            // Warangal
            { name: 'MGM Hospital', address: 'Warangal Town', rating: 4.2 },
            { name: 'Kakatiya Hospital', address: 'Hanamkonda, Warangal', rating: 4.0 },
            { name: 'Sri Krishna Hospital', address: 'Warangal', rating: 3.9 },
            // Karimnagar
            { name: 'District Hospital Karimnagar', address: 'Karimnagar Town', rating: 3.9 },
            { name: 'Chalmeda Anand Rao Hospital', address: 'Karimnagar', rating: 4.1 },
            { name: 'KIMS Hospital Karimnagar', address: 'Karimnagar', rating: 4.2 },
            // Nizamabad
            { name: 'Government General Hospital', address: 'Nizamabad Town', rating: 3.8 },
            { name: 'Kamineni Hospital', address: 'Nizamabad', rating: 4.0 },
            // Khammam
            { name: 'District Hospital Khammam', address: 'Khammam Town', rating: 3.8 },
            { name: 'Continental Hospital Khammam', address: 'Khammam', rating: 4.0 },
            // Mahbubnagar
            { name: 'Government Hospital Mahbubnagar', address: 'Mahbubnagar', rating: 3.7 },
            // Adilabad
            { name: 'RIMS Adilabad', address: 'Adilabad Town', rating: 3.8 },
            // Nalgonda
            { name: 'Government General Hospital', address: 'Nalgonda Town', rating: 3.7 },
            // Ramagundam
            { name: 'Area Hospital Ramagundam', address: 'Ramagundam', rating: 3.7 },
            // Suryapet
            { name: 'Area Hospital Suryapet', address: 'Suryapet', rating: 3.6 },
            // Siddipet
            { name: 'Area Hospital Siddipet', address: 'Siddipet', rating: 3.7 },
        ],
    },
    {
        title: 'Education',
        slug: 'education',
        description: 'Find premier universities, engineering colleges, medical schools, and research institutes across Telangana.',
        icon: GraduationCap,
        iconColor: 'text-green-500',
        iconBg: 'bg-green-50',
        places: [
            // Premier National Institutes
            { name: 'Indian School of Business (ISB)', address: 'Gachibowli, Hyderabad', rating: 4.9 },
            { name: 'IIT Hyderabad', address: 'Kandi, Sangareddy', rating: 4.8 },
            { name: 'IIIT Hyderabad', address: 'Gachibowli, Hyderabad', rating: 4.8 },
            { name: 'NIT Warangal', address: 'Warangal', rating: 4.7 },
            { name: 'BITS Pilani Hyderabad', address: 'Jawahar Nagar, Shamirpet', rating: 4.6 },
            { name: 'NALSAR University of Law', address: 'Shamirpet, Medchal', rating: 4.6 },
            { name: 'NIFT Hyderabad', address: 'Madhapur, Hyderabad', rating: 4.4 },
            { name: 'Indian Institute of Chemical Technology', address: 'Tarnaka, Hyderabad', rating: 4.5 },
            // Central Universities
            { name: 'University of Hyderabad', address: 'Gachibowli', rating: 4.7 },
            { name: 'English & Foreign Languages University', address: 'Tarnaka', rating: 4.4 },
            { name: 'Maulana Azad National Urdu University', address: 'Gachibowli', rating: 4.3 },
            // State Universities
            { name: 'Osmania University', address: 'Amberpet, Hyderabad', rating: 4.5 },
            { name: 'JNTU Hyderabad', address: 'Kukatpally, Hyderabad', rating: 4.3 },
            { name: 'Kakatiya University', address: 'Warangal', rating: 4.2 },
            { name: 'Telangana University', address: 'Nizamabad', rating: 4.0 },
            { name: 'Mahatma Gandhi University', address: 'Nalgonda', rating: 3.9 },
            { name: 'Palamuru University', address: 'Mahbubnagar', rating: 3.9 },
            { name: 'Satavahana University', address: 'Karimnagar', rating: 4.0 },
            { name: 'Jawaharlal Nehru Architecture University', address: 'Masab Tank, Hyderabad', rating: 4.2 },
            { name: 'Dr. BR Ambedkar Open University', address: 'Jubilee Hills, Hyderabad', rating: 4.0 },
            { name: 'Potti Sreeramulu Telugu University', address: 'Nampally, Hyderabad', rating: 3.9 },
            // Top Engineering Colleges
            { name: 'CBIT', address: 'Gandipet, Hyderabad', rating: 4.3 },
            { name: 'Vasavi College of Engineering', address: 'Ibrahimbagh, Hyderabad', rating: 4.2 },
            { name: 'Chaitanya Bharathi Institute', address: 'Gandipet, Hyderabad', rating: 4.1 },
            { name: 'VNR VJIET', address: 'Bachupally, Hyderabad', rating: 4.2 },
            { name: 'MVSR Engineering College', address: 'Nadargul, Hyderabad', rating: 4.0 },
            { name: 'GRIET', address: 'Bachupally, Hyderabad', rating: 4.0 },
            { name: 'BVRIT', address: 'Narsapur, Medak', rating: 4.0 },
            { name: 'Mahindra University', address: 'Bahadurpally, Hyderabad', rating: 4.3 },
            { name: 'ANURAG University', address: 'Ghatkesar, Hyderabad', rating: 4.0 },
            { name: 'Vardhaman College of Engineering', address: 'Shamshabad, Hyderabad', rating: 4.1 },
            { name: 'Sreenidhi Institute of Technology', address: 'Ghatkesar, Hyderabad', rating: 4.0 },
            { name: 'CVR College of Engineering', address: 'Ibrahimpatnam, Hyderabad', rating: 3.9 },
            { name: 'JNTU College of Engineering (Jagtiyal)', address: 'Jagtial', rating: 3.8 },
            // Medical Colleges
            { name: 'Gandhi Medical College', address: 'Musheerabad, Hyderabad', rating: 4.3 },
            { name: 'Osmania Medical College', address: 'Koti, Hyderabad', rating: 4.4 },
            { name: 'Deccan College of Medical Sciences', address: 'Kanchanbagh', rating: 4.1 },
            { name: 'Kakatiya Medical College', address: 'Warangal', rating: 4.2 },
            { name: 'MNR Medical College', address: 'Sangareddy', rating: 3.9 },
            { name: 'Government Medical College Nizamabad', address: 'Nizamabad', rating: 3.8 },
            { name: 'Government Medical College Mahbubnagar', address: 'Mahbubnagar', rating: 3.7 },
            // Research Institutes
            { name: 'ICRISAT', address: 'Patancheru, Sangareddy', rating: 4.6 },
            { name: 'CCMB', address: 'Tarnaka, Hyderabad', rating: 4.7 },
            { name: 'IICT', address: 'Tarnaka, Hyderabad', rating: 4.5 },
            { name: 'DRDO Research Centre (DRDL)', address: 'Kanchanbagh', rating: 4.4 },
            { name: 'NIRDPR', address: 'Rajendranagar, Hyderabad', rating: 4.3 },
            { name: 'CDFD', address: 'Tarnaka, Hyderabad', rating: 4.5 },
            { name: 'NIN (National Institute of Nutrition)', address: 'Tarnaka, Hyderabad', rating: 4.4 },
            { name: 'NGRI', address: 'Uppal, Hyderabad', rating: 4.3 },
            { name: 'NRSC (ISRO)', address: 'Balanagar, Hyderabad', rating: 4.5 },
            // Schools (CBSE/ICSE)
            { name: 'Hyderabad Public School', address: 'Begumpet, Hyderabad', rating: 4.6 },
            { name: 'Chirec International School', address: 'Kondapur, Hyderabad', rating: 4.5 },
            { name: 'Oakridge International School', address: 'Gachibowli, Hyderabad', rating: 4.5 },
            { name: 'DPS Hyderabad', address: 'Mahendra Hills, Secunderabad', rating: 4.4 },
            { name: 'Meridian School', address: 'Madhapur, Hyderabad', rating: 4.3 },
        ],
    },
    {
        title: 'Places of Worship',
        slug: 'worship',
        description: 'Discover temples, mosques, churches, gurudwaras, and spiritual centers across all of Telangana.',
        icon: Church,
        iconColor: 'text-amber-500',
        iconBg: 'bg-amber-50',
        places: [
            // Hyderabad - Hindu Temples
            { name: 'Birla Mandir', address: 'Naubat Pahad, Hyderabad', rating: 4.7 },
            { name: 'Chilkur Balaji Temple (Visa Temple)', address: 'Chilkur Village, Hyderabad', rating: 4.8 },
            { name: 'Jagannath Temple', address: 'Banjara Hills, Hyderabad', rating: 4.5 },
            { name: 'Peddamma Gudi', address: 'Jubilee Hills, Hyderabad', rating: 4.3 },
            { name: 'Sanghi Temple', address: 'Sanghi Nagar, Hyderabad', rating: 4.4 },
            { name: 'Karmanghat Hanuman Temple', address: 'Karmanghat, Hyderabad', rating: 4.3 },
            { name: 'Ashtalakshmi Temple', address: 'Karmanghat, Hyderabad', rating: 4.2 },
            { name: 'Akkanna Madanna Temple', address: 'Hussain Sagar, Hyderabad', rating: 4.2 },
            { name: 'Erramanzil Mahalakshmi Temple', address: 'Red Hills, Hyderabad', rating: 4.1 },
            { name: 'Pentapally Hanuman Temple', address: 'Gachibowli, Hyderabad', rating: 4.0 },
            { name: 'Pedda Balaji Temple', address: 'Khairatabad, Hyderabad', rating: 4.1 },
            // Hyderabad - Mosques
            { name: 'Mecca Masjid', address: 'Near Charminar, Hyderabad', rating: 4.6 },
            { name: 'Jama Masjid', address: 'Abids, Hyderabad', rating: 4.3 },
            { name: 'Spanish Mosque (Jami Masjid)', address: 'Near Charminar, Hyderabad', rating: 4.4 },
            { name: 'Toli Masjid', address: 'Tolichowki, Hyderabad', rating: 4.2 },
            { name: 'Kulsumpura Mosque', address: 'Kulsumpura, Hyderabad', rating: 4.0 },
            { name: 'Hayat Bakshi Begum Mosque', address: 'Golconda Fort, Hyderabad', rating: 4.3 },
            // Hyderabad - Churches
            { name: 'St. Joseph\'s Cathedral', address: 'Gunfoundry, Hyderabad', rating: 4.4 },
            { name: 'Wesley Church', address: 'Secunderabad', rating: 4.2 },
            { name: 'Holy Trinity Church', address: 'MG Road, Secunderabad', rating: 4.3 },
            { name: 'All Saints Church', address: 'Trimulgherry, Secunderabad', rating: 4.2 },
            { name: 'St. Mary\'s Church', address: 'Secunderabad', rating: 4.1 },
            { name: 'St. George\'s Church', address: 'Abids, Hyderabad', rating: 4.0 },
            // Hyderabad - Dargahs
            { name: 'Yousufain Dargah', address: 'Nampally, Hyderabad', rating: 4.3 },
            { name: 'Pahadi Shareef Dargah', address: 'Pahadi Shareef, Hyderabad', rating: 4.4 },
            { name: 'Dargah Hussain Shah Wali', address: 'Golconda, Hyderabad', rating: 4.2 },
            // Hyderabad - Gurudwaras
            { name: 'Gurudwara Sahib Secunderabad', address: 'Guru Nanak Road, Secunderabad', rating: 4.4 },
            { name: 'Gurudwara Sahib Ameerpet', address: 'Ameerpet, Hyderabad', rating: 4.2 },
            // Major Telangana Temples
            { name: 'Yadadri Lakshmi Narasimha Temple', address: 'Yadagirigutta', rating: 4.8 },
            { name: 'Vemulawada Rajanna Temple', address: 'Vemulawada, Rajanna Sircilla', rating: 4.7 },
            { name: 'Bhadrachalam Sri Rama Temple', address: 'Bhadrachalam', rating: 4.7 },
            { name: 'Ramappa Temple (UNESCO)', address: 'Palampet, Mulugu', rating: 4.8 },
            { name: 'Bhadrakali Temple', address: 'Warangal', rating: 4.5 },
            { name: 'Thousand Pillar Temple', address: 'Hanamkonda, Warangal', rating: 4.5 },
            { name: 'Basar Saraswati Temple', address: 'Basar, Nirmal', rating: 4.6 },
            { name: 'Kaleshwaram Mukteshwara Temple', address: 'Kaleshwaram', rating: 4.6 },
            { name: 'Alampur Jogulamba Temple', address: 'Alampur, Jogulamba Gadwal', rating: 4.5 },
            { name: 'Dharmapuri Narasimha Temple', address: 'Dharmapuri, Jagtial', rating: 4.4 },
            { name: 'Kondagattu Anjaneya Temple', address: 'Kondagattu, Jagtial', rating: 4.3 },
            { name: 'Keesaragutta Temple', address: 'Keesara, Medchal', rating: 4.3 },
            { name: 'Komurelly Mallanna Temple', address: 'Siddipet', rating: 4.3 },
            { name: 'Edupayala Vana Durgamma Temple', address: 'Medak', rating: 4.3 },
            { name: 'Pillalamarri Archeswara Temple', address: 'Suryapet', rating: 4.1 },
            { name: 'Nagunur Fort Temple', address: 'Nagunur, Karimnagar', rating: 4.0 },
            { name: 'Padmakshi Temple', address: 'Hanamkonda, Warangal', rating: 4.2 },
            { name: 'Ananthagiri Temple', address: 'Vikarabad', rating: 4.3 },
            { name: 'Kollapur Sri Uma Maheshwara Temple', address: 'Nagarkurnool', rating: 4.2 },
            { name: 'Kothakonda Veerabhadra Temple', address: 'Warangal', rating: 4.0 },
            { name: 'Kolanupaka Jain Temple', address: 'Yadadri Bhuvanagiri', rating: 4.1 },
            { name: 'Panagal Someshwara Temple', address: 'Nalgonda', rating: 4.0 },
            { name: 'Kanteshwar Temple', address: 'Nizamabad', rating: 4.2 },
            // Churches - Outside Hyderabad
            { name: 'Medak Church (Church of South India)', address: 'Medak Town', rating: 4.6 },
            { name: 'St. Patrick\'s Church', address: 'Secunderabad', rating: 4.1 },
            // Navabrahma Temples (Alampur cluster)
            { name: 'Taraka Brahma Temple', address: 'Alampur', rating: 4.2 },
            { name: 'Swarga Brahma Temple', address: 'Alampur', rating: 4.3 },
            { name: 'Vishwa Brahma Temple', address: 'Alampur', rating: 4.1 },
            { name: 'Kumara Brahma Temple', address: 'Alampur', rating: 4.0 },
        ],
    },
];

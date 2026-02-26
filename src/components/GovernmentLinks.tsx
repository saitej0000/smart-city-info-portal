import React from 'react';
import { ExternalLink, Building2, Scale, Heart, Bus, Lightbulb, Shield, Globe, BookOpen, Gavel, Sprout, GraduationCap, Coins, Droplets } from 'lucide-react';

const categories = [
  {
    title: "Civic Services & Administration",
    links: [
      { name: "MeeSeva Portal", url: "https://ts.meeseva.telangana.gov.in", icon: Globe, desc: "One-stop portal for citizen services, certificates, and bill payments." },
      { name: "Chief Minister's Office", url: "https://cm.telangana.gov.in", icon: Building2, desc: "Official website of the CM, press releases, and initiatives." },
      { name: "GHMC", url: "https://www.ghmc.gov.in", icon: Building2, desc: "Greater Hyderabad Municipal Corporation services and info." },
      { name: "Registration & Stamps", url: "https://registration.telangana.gov.in", icon: BookOpen, desc: "Property registration, encumbrance certificates, and deeds." },
      { name: "Election Commission", url: "https://ceotelangana.nic.in", icon: Globe, desc: "Voter registration, electoral rolls, and election information." },
    ]
  },
  {
    title: "Agriculture & Rural Development",
    links: [
      { name: "Agriculture Dept", url: "https://agri.telangana.gov.in", icon: Sprout, desc: "Farmer welfare, crop information, and departmental schemes." },
      { name: "Rythu Bandhu", url: "https://agriolms.telangana.gov.in", icon: Sprout, desc: "Investment support scheme for farmers." },
      { name: "Animal Husbandry", url: "https://ahddf.telangana.gov.in", icon: Sprout, desc: "Livestock development and veterinary services." },
    ]
  },
  {
    title: "Health & Welfare",
    links: [
      { name: "Aarogyasri", url: "https://rajivaarogyasri.telangana.gov.in", icon: Heart, desc: "Health insurance scheme for below poverty line families." },
      { name: "Aasara Pensions", url: "https://www.aasara.telangana.gov.in", icon: Heart, desc: "Social safety net pensions for elderly, widows, and disabled." },
      { name: "Public Health", url: "https://chfw.telangana.gov.in/home.do", icon: Heart, desc: "Family welfare and public health initiatives." },
    ]
  },
  {
    title: "Education",
    links: [
      { name: "School Education", url: "https://schooledu.telangana.gov.in", icon: GraduationCap, desc: "Primary and secondary education resources." },
      { name: "Higher Education Council", url: "https://www.tgche.ac.in", icon: GraduationCap, desc: "Higher education planning and coordination." },
      { name: "Technical Education", url: "https://dte.telangana.gov.in", icon: GraduationCap, desc: "Polytechnic and technical course information." },
    ]
  },
  {
    title: "Police & Public Safety",
    links: [
      { name: "Telangana State Police", url: "https://www.tspolice.gov.in", icon: Shield, desc: "Law enforcement, safety tips, and reporting." },
      { name: "Hyderabad City Police", url: "https://hyderabadpolice.gov.in", icon: Shield, desc: "Traffic info and city-specific police services." },
    ]
  },
  {
    title: "Utilities & Infrastructure",
    links: [
      { name: "TS GENCO", url: "https://www.tggenco.co.in", icon: Lightbulb, desc: "Power generation and electricity information." },
      { name: "Mission Bhagiratha", url: "https://missionbhagiratha.telangana.gov.in", icon: Droplets, desc: "Safe drinking water project details." },
      { name: "Irrigation Dept", url: "https://irrigation.telangana.gov.in", icon: Droplets, desc: "Water resources and irrigation projects." },
    ]
  },
  {
    title: "Finance & Revenue",
    links: [
      { name: "Finance Department", url: "https://finance.telangana.gov.in", icon: Coins, desc: "Budget, expenditure, and financial policies." },
      { name: "Commercial Taxes", url: "https://www.tgct.gov.in/tgportal", icon: Coins, desc: "GST and commercial tax administration." },
      { name: "CCLA", url: "https://ccla.telangana.gov.in", icon: BookOpen, desc: "Chief Commissioner of Land Administration." },
    ]
  }
];

export default function GovernmentLinks() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Telangana State Directory</h1>
        <p className="text-gray-500">Official government websites and resources for citizens.</p>
      </div>

      <div className="space-y-10">
        {categories.map((category, idx) => (
          <div key={idx}>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
              {category.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.links.map((link, linkIdx) => (
                <a 
                  key={linkIdx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group flex flex-col h-full"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <link.icon size={24} />
                    </div>
                    <ExternalLink size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{link.name}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{link.desc}</p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

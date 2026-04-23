// Global Azure sessions data
export interface AzureSession {
  Title: string;
  Owner: string;
  Track: string;
  FirstName: string;
  LastName: string;
  TagLine: string | null;
  LinkedIn: string;
}

export const globalAzureSessions: AzureSession[] = [
  {
    Title: "MVP - Security",
    Owner: "Pathum Udana",
    Track: "General",
    FirstName: "Pathum",
    LastName: "Udana",
    TagLine: "Coming Soon - Microsoft Partner",
    LinkedIn: "https://www.linkedin.com/in/pathumudana/",
  },
  {
    Title: "Sr. Cloud Solution Architect | MVP | MCT",
    Owner: "Thisara Perera ",
    Track: "General",
    FirstName: "Thisara",
    LastName: "Perera",
    TagLine: "Coming Soon - Microsoft Partner",
    LinkedIn: "https://www.linkedin.com/in/thisara-perera/",
  },
  {
    Title: "Senior Data Scientist at EY GDS",
    Owner: "Aloka Abeysirigunawardana",
    Track: "General",
    FirstName: "Aloka",
    LastName: "Abeysirigunawardana",
    TagLine: "Coming Soon - Microsoft Partner",
    LinkedIn: "https://www.linkedin.com/in/aloka-abeysirigunawardana-338a9b185/",
  },
  {
    Title: "Senior Solution Specialist at Microsoft ",
    Owner: "Prabhath Mannapperuma",
    Track: "General",
    FirstName: "Prabhath",
    LastName: "Mannapperuma",
    TagLine: "Coming Soon - Microsoft Partner",
    LinkedIn: "https://www.linkedin.com/in/dprabhath/",
  },
  {
    Title: "Head of Hybrid Cloud Engineering, MCT (2019-2026)",
    Owner: "Rizmi Razik",
    Track: "General",
    FirstName: "Rizmi",
    LastName: "Razik",
    TagLine: "Coming Soon - Microsoft Partner",
    LinkedIn: "https://www.linkedin.com/in/rizmi-razik-9a6b4551/",
  },
 
];

export default globalAzureSessions;

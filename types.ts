
export interface Student {
  name: string;
  class: string;
  section: string;
  studentId: string;
  contact: string;
}

export interface CardConfig {
  issuedYear: string;
  validUntil: string;
  schoolName: string;
  schoolAddress: string;
  qrColor: string;
  qrBgColor: string;
  logoUrl: string;       // Front (School) Logo
  backLogoUrl: string;   // Back (QwickAttend) Logo

  // Visual Customization
  cardBgColor: string;
  accentColor: string;
  textColor: string;      // Main Front Text (Name, School)
  detailsColor: string;   // Content Text (Class, Section, ID, Contact)
  labelColor: string;     // Label Text (CLASS, SECTION, etc.)
  backTextColor: string;  // Back Side Text (Header, Disclaimer)
  showPattern: boolean;

  // Label Customization
  labelClass: string;
  labelSection: string;
  labelId: string;
  labelContact: string;
  
  // New Date Labels
  labelIssued: string;
  labelValid: string;
  
  // Disclaimer
  disclaimerText: string;

  // Field Visibility
  showContact: boolean;
}

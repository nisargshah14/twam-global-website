export interface CarouselSlide {
  image: string;
  alt: string;
}

export interface Stat {
  num: string;
  label: string;
}

export interface WhyCard {
  icon: string;
  title: string;
  desc: string;
}

export interface HomeContent {
  hero: {
    headline: string;
    subheadline: string;
    badge: string;
    cta_text: string;
    carousel_slides: CarouselSlide[];
    stats: Stat[];
  };
  about_preview: {
    heading1: string;
    heading2: string;
    para1: string;
    para2: string;
    image_main: string;
    image_accent: string;
    badge_num: string;
    badge_label: string;
  };
  why_us: {
    heading: string;
    cards: WhyCard[];
  };
  cta: {
    heading: string;
    subtext: string;
    image: string;
  };
}

export interface AboutContent {
  heading: string;
  subtext: string;
  hero_image: string;
  intro: {
    heading: string;
    para1: string;
    para2: string;
    para3: string;
    image: string;
  };
  stats: Stat[];
  vision: { heading: string; content: string; };
  mission: { heading: string; content: string; };
}

export interface ProductItem {
  name: string;
  sublabel: string;
  image: string;
}

export interface ProductCategory {
  name: string;
  emoji: string;
  cover_image: string;
  description: string;
  products: ProductItem[];
}

export interface ContactContent {
  company_name: string;
  tagline: string;
  founded: string;
  email1: string;
  email2: string;
  phone1: string;
  phone2: string;
  address1: string;
  address2: string;
  address3: string;
  hours: string;
  maps_url: string;
  hero_heading: string;
  hero_tag: string;
  hero_subtext: string;
  hero_image: string;
  info_heading: string;
  info_subtext: string;
  form_heading: string;
  form_subtext: string;
  certifications: string[];
  footer_text: string;
  strip_response_time: string;
  strip_countries: string;
  city_heading: string;
}

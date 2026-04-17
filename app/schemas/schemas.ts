export interface FoodItem {
  description: string;
  grade: number;
  id: number;
  image_key: string;
  url: string;
  location: string;
  name: string;
  type: string;
  user_id: number;
  created_at: string;
}

export interface NewItems {
    restaurant_name: string | null;
    menu_item: string | null;
    image_key: string;
    user_id: number;
    visited: boolean;
    url: string;
}

export interface User {
  created_at: string;
  email: string;
  id: number;
  user_name: string;
  full_name: string;
  url: string;
  bio: string | null;
  phone_number: string;
  profile_image_key?: string;
}

export interface Following {
  following_id: number;
  follower_id: number;
}

export interface Followers {
  following_id: number;
  follower_id: number;
}

export interface TryLater {
  restaurant_name: string;
  menu_item: string;
  image_key: string;
  visited: string;
  url: string | null;
}

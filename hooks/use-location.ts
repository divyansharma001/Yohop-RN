import { useState } from 'react';

const DEFAULT_LOCATION = {
  latitude: 33.749,
  longitude: -84.388,
  label: 'Atlanta, GA',
};

export type UserLocation = {
  latitude: number;
  longitude: number;
  label: string;
};

export function useLocation(): {
  location: UserLocation;
  setLocation: (loc: UserLocation) => void;
} {
  const [location, setLocation] = useState<UserLocation>(DEFAULT_LOCATION);
  return { location, setLocation };
}

export { DEFAULT_LOCATION };

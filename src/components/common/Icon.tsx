import React from 'react';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

export type IconName =
  | 'play'
  | 'pause'
  | 'home'
  | 'world-map'
  | 'rewards'
  | 'profile'
  | 'stats'
  | 'settings'
  | 'coin'
  | 'star'
  | 'star-outline'
  | 'heart'
  | 'fire'
  | 'timer'
  | 'hint'
  | 'shuffle'
  | 'reveal'
  | 'check'
  | 'close'
  | 'arrow-back'
  | 'arrow-forward'
  | 'lock'
  | 'unlock'
  | 'refresh'
  | 'sound-on'
  | 'sound-off'
  | 'vibrate'
  | 'help'
  | 'shield'
  | 'document'
  | 'shop'
  | 'ad-video'
  | 'google'
  | 'category'
  | 'chevron-right';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = colors.text,
}) => {
  switch (name) {
    case 'play':
      return <Ionicons name="play" size={size} color={color} />;
    case 'pause':
      return <Ionicons name="pause" size={size} color={color} />;
    case 'home':
      return <Ionicons name="home" size={size} color={color} />;
    case 'world-map':
      return <MaterialCommunityIcons name="map-legend" size={size} color={color} />;
    case 'rewards':
      return <Ionicons name="gift" size={size} color={color} />;
    case 'profile':
      return <Ionicons name="person" size={size} color={color} />;
    case 'stats':
      return <Ionicons name="stats-chart" size={size} color={color} />;
    case 'settings':
      return <Ionicons name="settings-sharp" size={size} color={color} />;
    case 'coin':
      return <MaterialCommunityIcons name="circle-multiple" size={size} color={color} />;
    case 'star':
      return <Ionicons name="star" size={size} color={color} />;
    case 'star-outline':
      return <Ionicons name="star-outline" size={size} color={color} />;
    case 'heart':
      return <Ionicons name="heart" size={size} color={color} />;
    case 'fire':
      return <MaterialCommunityIcons name="fire" size={size} color={color} />;
    case 'timer':
      return <Ionicons name="timer-outline" size={size} color={color} />;
    case 'hint':
      return <MaterialCommunityIcons name="lightbulb-on" size={size} color={color} />;
    case 'shuffle':
      return <Ionicons name="shuffle" size={size} color={color} />;
    case 'reveal':
      return <MaterialCommunityIcons name="eye" size={size} color={color} />;
    case 'check':
      return <Ionicons name="checkmark-circle" size={size} color={color} />;
    case 'close':
      return <Ionicons name="close" size={size} color={color} />;
    case 'arrow-back':
      return <Ionicons name="arrow-back" size={size} color={color} />;
    case 'arrow-forward':
      return <Ionicons name="arrow-forward" size={size} color={color} />;
    case 'lock':
      return <Ionicons name="lock-closed" size={size} color={color} />;
    case 'unlock':
      return <Ionicons name="lock-open" size={size} color={color} />;
    case 'refresh':
      return <Ionicons name="refresh" size={size} color={color} />;
    case 'sound-on':
      return <Ionicons name="volume-high" size={size} color={color} />;
    case 'sound-off':
      return <Ionicons name="volume-mute" size={size} color={color} />;
    case 'vibrate':
      return <MaterialCommunityIcons name="vibrate" size={size} color={color} />;
    case 'help':
      return <Ionicons name="help-circle-outline" size={size} color={color} />;
    case 'shield':
      return <Ionicons name="shield-checkmark-outline" size={size} color={color} />;
    case 'document':
      return <Ionicons name="document-text-outline" size={size} color={color} />;
    case 'shop':
      return <MaterialCommunityIcons name="store" size={size} color={color} />;
    case 'ad-video':
      return <MaterialCommunityIcons name="television-play" size={size} color={color} />;
    case 'google':
      return <FontAwesome5 name="google" size={size * 0.9} color={color} />;
    case 'category':
      return <Ionicons name="grid-outline" size={size} color={color} />;
    case 'chevron-right':
      return <Ionicons name="chevron-forward" size={size} color={color} />;
    default:
      return <Ionicons name="ellipse" size={size} color={color} />;
  }
};

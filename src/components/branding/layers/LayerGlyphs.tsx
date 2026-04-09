import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const Layer1Physical = ({ color = '#333' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Path 
      d="M18 10V4M6 10V4M12 10V4M11 16H13V22H11V16ZM4 10H20V16H4V10Z" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
    />
  </Svg>
);

export const Layer2Datalink = ({ color = '#333' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Path 
      d="M4 6H20M4 18H20M7 6L7 18M17 6L17 18" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
    />
  </Svg>
);

export const Layer3Network = ({ color = '#333' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Path 
      d="M12 2L2 12L12 22L22 12L12 2ZM12 8V16M8 12H16" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
    />
  </Svg>
);

export const Layer4Transport = ({ color = '#333' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Path 
      d="M7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12ZM12 2V5M12 19V22M2 12H5M19 12H22" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
    />
  </Svg>
);

export const Layer5Session = ({ color = '#333' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Path 
      d="M12 4V8M8 12H4M20 12H16M12 20V16M18 6L15 9M6 18L9 15M6 6L9 9M18 18L15 15" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
    />
  </Svg>
);

export const Layer6Presentation = ({ color = '#333' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Path 
      d="M12 3L4 7V17L12 21L20 17V7L12 3ZM12 7V12M12 12L8 15M12 12L16 15" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
    />
  </Svg>
);

export const Layer7Application = ({ color = '#333' }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Path 
      d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM2 12H22M12 2V22" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
    />
  </Svg>
);

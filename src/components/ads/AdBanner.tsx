import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { ENV } from '@/config/env';

interface AdBannerProps {
  placement?: string;
}

export const AdBanner: React.FC<AdBannerProps> = () => {
  const [adError, setAdError] = useState(false);

  // Return null on Web or during Jest tests
  if (Platform.OS === 'web' || process.env.NODE_ENV === 'test' || adError) {
    return null;
  }

  const adUnitId = ENV.isDev
    ? TestIds.BANNER
    : (ENV.admob.bannerAdUnitId || TestIds.BANNER);

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={(error) => {
          console.warn('[AdBanner] Ad failed to load:', error);
          setAdError(true);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: '100%',
    paddingVertical: 4,
  },
});

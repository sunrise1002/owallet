import React, { FunctionComponent, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@src/components/text';
import { useStyle } from '../../../../styles';
import { CheckIcon, CopyFillIcon } from '../../../../components/icon';
import { Button, OWButton } from '../../../../components/button';
import { WordChip } from '../../../../components/mnemonic';
import Clipboard from 'expo-clipboard';
import { PageWithScrollViewInBottomTabView } from '../../../../components/page';
import { useSimpleTimer } from '../../../../hooks';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { spacing, typography } from '../../../../themes';
import { RectButton } from 'react-native-gesture-handler';
import { OWBox } from '@src/components/card';
import { useGetHeightHeader } from '@src/hooks/use-height-header';
import { useTheme } from '@src/themes/theme-provider';

export const getPrivateDataTitle = (
  keyRingType: string,
  capitalize?: boolean
) => {
  if (capitalize) {
    return `View ${
      keyRingType === 'mnemonic' ? 'Mnemonic Seed' : 'Private Key'
    }`;
  }

  return `View ${keyRingType === 'mnemonic' ? 'mnemonic seed' : 'private key'}`;
};

export const canShowPrivateData = (keyRingType: string): boolean => {
  return keyRingType === 'mnemonic' || keyRingType === 'privateKey';
};

export const ViewPrivateDataScreen: FunctionComponent = () => {
  const style = useStyle();

  const route = useRoute<
    RouteProp<
      Record<
        string,
        {
          privateData: string;
          privateDataType: string;
        }
      >,
      string
    >
  >();

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      title: getPrivateDataTitle(route.params.privateDataType, true)
    });
  }, [navigation, route.params.privateDataType]);

  const { isTimedOut, setTimer } = useSimpleTimer();

  const privateData = route.params.privateData;
  const privateDataType = route.params.privateDataType;

  const words = privateData.split(' ');
  const { colors } = useTheme();
  return (
    <PageWithScrollViewInBottomTabView>
      <OWBox>
        <View
          style={[
            styles.containerMnemonicWord,
            // { backgroundColor: colors['background-item-list'] }
          ]}
        >
          {privateDataType === 'mnemonic' ? (
            words.map((word, i) => {
              return <WordChip key={i.toString()} index={i + 1} word={word} />;
            })
          ) : (
            <Text
              style={{
                ...typography['h6'],
                marginBottom: spacing['30']
              }}
            >
              {words}
            </Text>
          )}
        </View>
        <OWButton
          size="medium"
          onPress={() => {
            Clipboard.setString(words.join(' ').trim());
            setTimer(2000);
          }}
          label="Copy to Clipboard"
          textStyle={styles.textStyle}
          icon={
            isTimedOut ? (
              <CheckIcon />
            ) : (
              <CopyFillIcon color={colors['white']} />
            )
          }
        />
      </OWBox>
    </PageWithScrollViewInBottomTabView>
  );
};

const styles = StyleSheet.create({
  containerMnemonicWord: {
    flexDirection: 'row',

    borderRadius: spacing['24'],
    padding: spacing['20'],
    marginBottom: spacing['20'],
    flexWrap: 'wrap'
  },
  textStyle: {
    paddingLeft: 10
  },
  containerBtn: {
    borderRadius: spacing['8'],
    paddingVertical: spacing['16'],
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textBtn: {
    ...typography.h6,
    fontWeight: '700',
    marginLeft: spacing['8']
  }
});

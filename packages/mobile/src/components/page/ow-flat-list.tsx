import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from 'react-native';
import React, { FC, ReactNode, useEffect } from 'react';
import { FlatListProps } from 'react-native';
import { OWEmpty } from '../empty';
import { _keyExtract } from '@src/utils/helper';
import { Skeleton } from '@rneui/themed';
import { metrics } from '@src/themes';
import { useTheme } from '@src/themes/theme-provider';
interface IOWFlatListProps extends FlatListProps<any> {
  loadMore?: boolean;
  loading?: boolean;
  SkeletonComponent?: FlatListProps<any>['ListHeaderComponent'];
}
const OWFlatList: FC<IOWFlatListProps> = (props) => {
  const { colors } = useTheme();
  const {
    SkeletonComponent = (
      <Skeleton
        animation="pulse"
        width={metrics.screenWidth - 48}
        height={65}
        style={{
          borderRadius: 12,
          backgroundColor: colors['background-item-list'],
          marginVertical: 8
        }}
        skeletonStyle={{
          backgroundColor: colors['skeleton']
        }}
      />
    ),
    loadMore,
    loading,
    onRefresh,
    ...rest
  } = props;

  return (
    <FlatList
      ListEmptyComponent={
        loading ? (
          <>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((it, inde) => {
              return <>{SkeletonComponent}</>;
            })}
          </>
        ) : (
          <OWEmpty />
        )
      }
      keyExtractor={_keyExtract}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={
        <View style={styles.footer}>
          {loadMore ? <ActivityIndicator /> : null}
        </View>
      }
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={onRefresh} />
      }
      {...rest}
    />
  );
};

export default OWFlatList;

const styles = StyleSheet.create({
  footer: {
    height: 20
  }
});

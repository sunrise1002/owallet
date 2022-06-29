import React, { FunctionComponent, ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../stores'
import { StyleSheet, View, ViewStyle, Image } from 'react-native'
import { Text } from '@rneui/base'
import { CoinPretty } from '@owallet/unit'
import { useSmartNavigation } from '../../navigation.provider'
import { Currency } from '@owallet/types'
import { TokenSymbol } from '../../components/token-symbol'
import { DenomHelper } from '@owallet/common'
import { Bech32Address } from '@owallet/cosmos'
import { colors, metrics, spacing, typography } from '../../themes'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import { _keyExtract } from '../../utils/helper'
import { TransactionMinusIcon } from '../../components/icon'
import LinearGradient from 'react-native-linear-gradient'
import {
  BuyIcon,
  DepositIcon,
  SendDashboardIcon
} from '../../components/icon/button'
import {
  TransactionItem,
  TransactionSectionTitle
} from '../transactions/components'
import { PageWithScrollViewInBottomTabView } from '../../components/page'

// hardcode data to test UI.
const txsReceiver = [
  {
    label: 'Recevier token 3',
    date: 'Apr 25, 2022',
    amount: '+100.02',
    denom: 'ORAI'
  },
  {
    label: 'Recevier token',
    date: 'Apr 25, 2022',
    amount: '+12.02',
    denom: 'ORAI'
  },
  {
    label: 'Recevier token',
    date: 'Apr 25, 2022',
    amount: '-100.02',
    denom: 'ORAI'
  },
  {
    label: 'Recevier token',
    date: 'Apr 25, 2022',
    amount: '-100.02',
    denom: 'ORAI'
  }
]

export const TokenDetailScreen: FunctionComponent = observer(() => {
  const { chainStore, queriesStore, accountStore } = useStore()
  const smartNavigation = useSmartNavigation()

  const account = accountStore.getAccount(chainStore.current.chainId)
  const queries = queriesStore.get(chainStore.current.chainId)

  const queryStakable = queries.queryBalances.getQueryBech32Address(
    account.bech32Address
  ).stakable
  const stakable = queryStakable.balance

  const queryDelegated = queries.cosmos.queryDelegations.getQueryBech32Address(
    account.bech32Address
  )
  const delegated = queryDelegated.total

  const queryUnbonding =
    queries.cosmos.queryUnbondingDelegations.getQueryBech32Address(
      account.bech32Address
    )
  const unbonding = queryUnbonding.total
  const stakedSum = delegated.add(unbonding)
  const total = stakable.add(stakedSum)
  const queryBalances = queriesStore
    .get(chainStore.current.chainId)
    .queryBalances.getQueryBech32Address(
      accountStore.getAccount(chainStore.current.chainId).bech32Address
    )
  const tokens = queryBalances.positiveNativeUnstakables
    .concat(queryBalances.nonNativeBalances)
    .slice(0, 2)

  const _onPressBtnMain = () => {}
  const RenderBtnMain = ({ name }) => {
    let icon: ReactElement
    switch (name) {
      case 'Buy':
        icon = <BuyIcon />
        break
      case 'Deposit':
        icon = <DepositIcon />
        break
      case 'Send':
        icon = <SendDashboardIcon />
        break
    }
    return (
      <TouchableOpacity
        style={{
          backgroundColor: colors['purple-900'],
          borderWidth: 0.5,
          borderRadius: spacing['8'],
          borderColor: colors['transparent'],
          marginLeft: 10,
          marginRight: 10
        }}
        onPress={() => _onPressBtnMain()}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: spacing['6'],
            paddingBottom: spacing['6'],
            paddingLeft: spacing['12'],
            paddingRight: spacing['12']
          }}
        >
          {icon}
          <Text
            style={{
              ...typography['h7'],
              lineHeight: spacing['20'],
              color: colors['white'],
              paddingLeft: spacing['6'],
              fontWeight: '700'
            }}
          >
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
  return (
    <PageWithScrollViewInBottomTabView>
      <View
        style={{
          borderWidth: spacing['0.5'],
          borderColor: colors['gray-100'],
          borderRadius: spacing['12'],
          marginHorizontal: spacing['24'],
          marginVertical: spacing['12']
        }}
      >
        <LinearGradient
          colors={['#161532', '#5E499A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderTopLeftRadius: spacing['11'],
            borderTopRightRadius: spacing['11'],
            borderBottomLeftRadius: spacing['11'],
            borderBottomRightRadius: spacing['11']
          }}
        >
          <View
            style={{
              marginTop: 24,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <TokenSymbol
              style={{
                marginRight: spacing['12']
              }}
              size={44}
              chainInfo={{
                stakeCurrency: chainStore.current.stakeCurrency
              }}
              currency={tokens[0].balance.currency}
              imageScale={0.54}
            />
            <View
              style={{
                justifyContent: 'space-between'
              }}
            >
              <Text
                style={{
                  ...typography.h3,
                  color: colors['white'],
                  marginTop: spacing['8'],
                  fontWeight: '800',
                  textAlign: 'center'
                }}
              >
                {`${0} ORAI`}
              </Text>
              <Text
                style={{
                  ...typography.h6,
                  color: colors['purple-400'],
                  textAlign: 'center'
                }}
              >
                {`$${0}`}
              </Text>
            </View>
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              paddingTop: spacing['6'],
              paddingLeft: spacing[22],
              paddingRight: spacing['22'],
              justifyContent: 'center',
              paddingBottom: spacing['24']
            }}
          >
            {['Buy', 'Deposit', 'Send'].map((e, i) => (
              <RenderBtnMain key={i} name={e} />
            ))}
          </View>
        </LinearGradient>

        {/* {queryStakable?.isFetching ? (
        <View
          style={{
            position: 'absolute',
            bottom: 50,
            left: '50%'
          }}
        >
          <LoadingSpinner color={colors['gray-150']} size={22} />
        </View>
         ) : null}  */}
      </View>

      <View
        style={{
          backgroundColor: colors['white'],
          borderRadius: spacing['24'],
          paddingBottom: spacing['24'],
          height: metrics.screenHeight /2
        }}
      >
        <TransactionSectionTitle title={'Transaction list'} />
        <FlatList
          data={txsReceiver}
          renderItem={({ item, index }) => (
            <TransactionItem
              item={item}
              key={index}
              onPress={() => smartNavigation.navigateSmart('Transactions.Detail', {})}
            />
          )}
          keyExtractor={_keyExtract}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => (<View style={{
            height: 12
          }} />)}
          ListEmptyComponent={
            <View style={styles.transactionListEmpty}>
              <Image
                source={require('../../assets/image/not_found.png')}
                resizeMode="contain"
                height={142}
                width={142}
              />
              <Text
                style={{
                  ...typography.subtitle2,
                  color: colors['gray-300'],
                  marginTop: spacing['8']
                }}
              >
                {`No result found`}
              </Text>
            </View>
          }
        />

        <TouchableOpacity
          style={{
            backgroundColor: colors['purple-900'],
            borderRadius: spacing['8'],
            marginHorizontal: spacing['24'],
            paddingVertical: spacing['16'],
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: spacing['12']
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <TransactionMinusIcon size={18} color={colors['white']} />
            <Text
              style={{
                ...typography.h6,
                color: colors['white'],
                fontWeight: '700',
                marginLeft: spacing['10']
              }}
            >
              View all transactions
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </PageWithScrollViewInBottomTabView>
  )
})


const styles = StyleSheet.create({
  containerToken: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing['4'],
    marginVertical: spacing['8'],
    paddingTop: spacing['18'],
    paddingBottom: spacing['18']
  },
  transactionListEmpty: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})

import React, {Component} from 'react'
import {connect} from './connect'
import {createSelector} from 'reselect'
import {findWhere} from 'underline'

import platformData from '../constants/platform-data'
import classificationActions from '../constants/classification-actions'

import format from '../util/format'
import interleave from './interleave'

import NiceAgo from './nice-ago'
import Icon from './icon'

export class GameStats extends Component {
  render () {
    const {t, cave, game = {}, downloadKey, mdash = true} = this.props
    const {lastTouched = 0, secondsRun = 0} = (cave || {})

    const classification = game.classification || 'game'
    const classAction = classificationActions[classification] || 'launch'
    const xed = classAction === 'open' ? 'opened' : ((classification === 'game') ? 'played' : 'used')
    const lastTouchedDate = new Date(lastTouched)

    if (cave) {
      return <div className='game-stats'>
        {secondsRun > 0 && classAction === 'launch'
          ? <div className='total-playtime'>
            <span><label>{t(`usage_stats.has_${xed}_for_duration`)}</label> {t.format(format.seconds(secondsRun))}</span>
          </div>
          : ''
        }
        <div className='last-playthrough'>
        {lastTouched > 0
          ? <label>
            {interleave(t, `usage_stats.last_${xed}_time_ago`, {time_ago: <NiceAgo date={lastTouchedDate}/>})}
          </label>
          : t(`usage_stats.never_${xed}`)
        }
        </div>
      </div>
    } else {
      const platforms = []
      if (classAction === 'launch') {
        for (const p of platformData) {
          if (game[p.field]) {
            platforms.push(<Icon title={p.platform} icon={p.icon}/>)
          }
        }
      }
      const {minPrice, currency = 'USD'} = game

      return <div className='game-stats'>
        <div className='total-playtime'>
        {t(`usage_stats.description.${classification}`)}
        {(platforms.length > 0)
          ? [' ', interleave(t, 'usage_stats.description.platforms', {platforms})]
          : ''
        }
        {mdash ? ' — ' : <br/>}
        {downloadKey
          ? interleave(t, 'usage_stats.description.bought_time_ago', {time_ago: <NiceAgo date={downloadKey.createdAt}/>})
          : (minPrice > 0
            ? interleave(t, 'usage_stats.description.price', {
              price: <label>
                {format.price(currency, minPrice)}
              </label>
            })
            : t('usage_stats.description.free_download')
          )
        }
        </div>
      </div>
    }
  }
}

const mapStateToProps = () => {
  return createSelector(
    (state, props) => state.market,
    (state, props) => state.globalMarket,
    (state, props) => props.game,
    (userMarket, globalMarket, game) => ({
      downloadKey: ((userMarket || {}).downloadKeys || {})::findWhere({gameId: game.id}),
      cave: globalMarket.cavesByGameId[game.id]
    })
  )
}

const mapDispatchToProps = () => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameStats)

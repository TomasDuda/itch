
import {connect as reduxConnect} from 'react-redux'
import {getT} from '../localizer'

export function connect (mapStateToProps, mapDispatchToProps) {
  const augmentedMapStateToProps = (state) => {
    const base = mapStateToProps(state)
    const {lang, strings} = state.i18n
    const t = getT(strings, lang)
    return {...base, t}
  }
  return reduxConnect(augmentedMapStateToProps, mapDispatchToProps)
}
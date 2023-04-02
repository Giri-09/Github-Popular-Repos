// Write your code here
import './index.css'

const LanguageFilterItem = props => {
  const {languagesList, clickItem, isActive} = props
  const {language, id} = languagesList

  const onActive = isActive && 'active'

  const onClickItem = () => {
    clickItem(id)
  }

  return (
    <li>
      <button
        type="button"
        className={`button ${onActive}`}
        onClick={onClickItem}
      >
        {language}
      </button>
    </li>
  )
}

export default LanguageFilterItem

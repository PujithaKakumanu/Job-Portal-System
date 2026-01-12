import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../redux/theme/themeSlice";
import { FaSun } from "react-icons/fa";

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12.75 2a9.25 9.25 0 000 18.5A9.25 9.25 0 0021 12.75c0-.12-.01-.24-.02-.36a7.38 7.38 0 01-5.31 2.11 7.5 7.5 0 01-7.5-7.5 7.38 7.38 0 012.11-5.31A9.263 9.263 0 0012.75 2z"/>
  </svg>
);

const ThemeToggle = () => {
    const theme = useSelector((state) => state.theme.value);
    const dispatch = useDispatch();

  return (
    <button onClick={()=>dispatch(toggleTheme())} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
      {theme === 'light' ? <MoonIcon /> : <FaSun size={24}/>}
    </button>
  );
};

export default ThemeToggle;

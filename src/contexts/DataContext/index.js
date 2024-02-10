import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null); // Ajout de last
  const getData = useCallback(async () => {
    try {
      const loadingData = await api.loadData()
      setData(loadingData);
      setLast(loadingData?.events[loadingData.events.length - 1]) // Récupére le dernier élément
    } catch (err) {
      setError(err);
    }    
  }, []);
  useEffect(() => {
    if (data) return;
    getData();
  });
  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        last,
        data,
        error
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;

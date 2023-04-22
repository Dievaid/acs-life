import React, { 
  useState
} from 'react';

import Background from './components/Background';
import MainPageContent from './components/MainPageContent';
import AuthForm from './components/AuthForm';
import { mainPageContext } from './components/Contexts';

const App: React.FC = () => {
  const [btnIsClicked, setButtonClicked] = useState<boolean>(false);

  return (
    <mainPageContext.Provider value={setButtonClicked}>
        <Background />
        {!btnIsClicked && <MainPageContent />}
        {btnIsClicked && <AuthForm />}
    </mainPageContext.Provider>
  );
}

export default App;

import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from "./components/context/UserContext";
import { FriendsProvider } from "./components/context/FriendsContext";
import { PostsProvider } from './components/context/PostsContext';
import { MessagesProvider } from "./components/context/MessagesContext";
import { SelectedUserProvider } from './components/context/SelectedUserContext';
import { ProfileProvider } from './components/context/ProfileContext';
import { LikedPostsProvider } from './components/context/LikedPostsContext';
import { DatesProvider } from './components/context/DatesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

TimeAgo.addDefaultLocale(en);

root.render(
  <Router>
    <UserProvider>
      <FriendsProvider>
        <PostsProvider>
          <MessagesProvider>
            <SelectedUserProvider>
              <ProfileProvider>
                <LikedPostsProvider>
                  <DatesProvider>
                    <App />
                  </DatesProvider>
                </LikedPostsProvider>
              </ProfileProvider>
            </SelectedUserProvider>
          </MessagesProvider>
        </PostsProvider>
      </FriendsProvider>
    </UserProvider>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
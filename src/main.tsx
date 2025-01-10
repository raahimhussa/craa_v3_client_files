// i18n
import './locales/i18n';

// highlight
import './utils/highlight';

// scroll bar
import 'simplebar/src/simplebar.css';

// lightbox
import 'react-image-lightbox/style.css';

// editor
import 'react-quill/dist/quill.snow.css';

// slick-carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';
import ReactDOM from 'react-dom'
import App from './App'
import { RootStoreProvider } from './stores'
import { SettingsProvider } from './contexts/SettingsContext'
import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext'
import { BrowserRouter } from 'react-router-dom'
import { SWRConfig } from 'swr'
import './index.css'
import './libs/axios/init'
import './libs/mobx/init'
import NotistackProvider from './ui/components/NotistackProvider';
// import './libs/react-pdf/init'
ReactDOM.render(
  <RootStoreProvider>
    <SWRConfig value={{ provider: () => new Map() }}>
      <SettingsProvider>
        <CollapseDrawerProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
        </CollapseDrawerProvider>
      </SettingsProvider>
    </SWRConfig>
  </RootStoreProvider>
  , document.getElementById('root')
)

import { NavHeader } from '@app/components/header/header';
import { Toasts } from '@app/components/toast/toasts';
import { VersionCheckerStatus } from '@app/components/version-checker/version-checker-status';
import { LandingPage } from '@app/pages/landing-page/landing-page';
import { Outlet, Route, Routes as Switch } from 'react-router-dom';

export const Router = () => (
  <Switch>
    <Route element={<AppWrapper />}>
      <Route path="/" element={<LandingPage />} />
    </Route>
  </Switch>
);

const AppWrapper = () => (
  <>
    <NavHeader />
    <Outlet />
    <Toasts />
    <VersionCheckerStatus />
  </>
);

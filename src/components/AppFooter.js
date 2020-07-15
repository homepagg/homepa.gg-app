import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { Link } from 'react-router-dom';
import { ReactComponent as CancelSvg } from '../images/icons/cancel.svg';
import styles from './AppFooter.module.css';

const AppFooter = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <footer className={styles.footer}>
      <p>
        <strong>Baile</strong> <em>/BAL-yeh/</em> (n.) Home.
      </p>
      <p>
        Made with love by Doug |{' '}
        <a
          href="https://github.com/doug-stewart/baile"
          rel="noopener noreferrer"
          target="_blank">
          Checkout on GitHub
        </a>{' '}
        |{' '}
        <button className={styles.link} onClick={() => setShowModal(true)}>
          Privacy
        </button>
        .
      </p>

      <ReactModal
        className={styles.modal}
        isOpen={showModal}
        overlayClassName={styles.overlay}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <button
          className={styles.close}
          onClick={() => setShowModal(false)}
          title="Close Settings">
          <CancelSvg />
        </button>
        <p>
          <em>Effective date: July 1st, 2020.</em>
        </p>
        <p>
          Online privacy is important. Baile only asks for the permissions and
          data it needs in order to do its job. You always remain in full, sole
          control and can revoke our access to anything and everything at any
          time.
        </p>
        <p>
          What&rsquo;s more, outside of the permissions we do ask for, Baile
          does not access, store or transmit any of your information or data.
          Ever. But you don&rsquo;t have to take our word for it. Baile is fully
          open source an you can{' '}
          <a
            href="https://github.com/doug-stewart/baile"
            rel="noopener noreferrer"
            target="_blank">
            check our code on GitHub
          </a>
          .
        </p>
        <h2>Permissions</h2>
        <p>
          Let&rsquo;s talk about what we do have access to and how we use it.
        </p>
        <h3>Dropbox</h3>
        <p>
          Baile uses your{' '}
          <a
            href="https://www.dropbox.com/"
            rel="noopener noreferrer"
            target="_blank">
            Dropbox account
          </a>{' '}
          to manage and sync your bookmarks and settings. Because of this any
          information you provide us is only ever stored in Dropbox or in your
          browser. It is never saved or transmitted anywhere else and we have no
          way to access any of it.
        </p>
        <p>
          You can remove all information from your browser at any time by{' '}
          <Link className={styles.logout} to="/logout">
            logging out
          </Link>
          . If you wish to stop using Baile at any time you can disconnect it
          from your Dropbox account on{' '}
          <a
            href="https://www.dropbox.com/account/connected_apps"
            rel="noopener noreferrer"
            target="_blank">
            Dropbox.com
          </a>
          .
        </p>
        <h3>Your Location</h3>
        <p>
          If you choose to have your theme change at sunrise and sunset, Baile
          will ask you for your location. This information is only stored in
          your browser as part of your current session. It is never transmitted
          or saved anywhere else, including Dropbox.
        </p>
        <p>
          If at any point you wish to stop allowing Baile to access your
          location, simply click the lock icon in your browser&rsquo;s address
          bar and revoke that permission. The next time Baile asks you for your
          location, simply say no. Don&rsquo;t worry, this doesn't break
          anything. When we don&rsquo;t know your location we simply assume you
          live in San Francisco (howdy, neighbor!) and will use that as your
          location.
        </p>
        <h3>I have questions!</h3>
        <p>
          For all problems, please file an issue on{' '}
          <a
            href="https://github.com/doug-stewart/baile/issues"
            rel="noopener noreferrer"
            target="_blank">
            GitHub
          </a>
          .
        </p>
      </ReactModal>
    </footer>
  );
};

export default AppFooter;

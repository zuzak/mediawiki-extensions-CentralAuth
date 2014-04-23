( function ( mw ) {
	// Are we already logged in?
	if ( mw.config.get( 'wgUserName' ) !== null ) {
		return;
	}

	// Do we already know we're logged out centrally?
	if ( mw.config.get( 'wgCanonicalSpecialPageName' ) !== 'Userlogin' ) {
		if ( 'localStorage' in window && window.localStorage && +localStorage.getItem( 'CentralAuthAnon' ) > new Date().getTime() ) {
			return;
		}

		// Can't use $.cookie(), because we want to check this at the top of
		// the page and that isn't loaded until the bottom.
		if ( /(^|; )CentralAuthAnon=1/.test( document.cookie ) ) {
			return;
		}
	}

	// Ok, perform the acutal logged-in check via a <script> tag. The
	// referenced URL will 302 a few times and then return appropriate
	// JavaScript to complete the process.
	var url, params, len, param, i;

	url = mw.config.get( 'wgCentralAuthCheckLoggedInURL' );
	if ( url ) {
		url += '&proto=' + encodeURIComponent( location.protocol.replace( ':', '' ) );
		if ( mw.config.get( 'wgCanonicalSpecialPageName' ) === 'Userlogin' ) {
			url += '&return=1';

			params = location.search.slice( 1 ).split( '&' );
			len = params.length;
			for ( i = 0; i < len; i++ ) {
				param = params[i].split( '=' );
				param = decodeURIComponent( param[0] );
				if ( param === 'returnto' || param === 'returntoquery' ) {
					url += '&' + params[i];
				}
			}
		}
		mw.loader.load( url );
	}
}( mediaWiki ) );

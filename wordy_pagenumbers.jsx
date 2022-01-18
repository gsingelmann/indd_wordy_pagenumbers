if (app.documents.length) {
	if ( false ) {
		main();
	} else {
		app.doScript(main, undefined, undefined, UndoModes.ENTIRE_SCRIPT, "Seiten nummerieren");
	}
} else {
}

function main() {
	if ( ! app.documents.length ) {
		alert("Dieses Script braucht ein offenes Dokument");
		return;
	}
	if ( ! app.selection.length ) {
		alert("Es braucht einen markierten Textrahmen zum Platzieren der Seitenzahlwörter");
		return;
	}
	if ( ! app.selection[0].parentPage ) {
		alert("Der Muster-Textrahmen muss auf einer Seite liegen");
		return;
	}

	var doc = app.activeDocument;
	var pro = doc.viewPreferences.rulerOrigin;
	doc.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
	var pzp = doc.zeroPoint;
	doc.zeroPoint = [0,0];

	var mtf = app.selection[0];

	if ( doc.documentPreferences.facingPages ) {
		var prefs = get_prefs() 
		if ( ! prefs ) return;
	} else {
		var prefs = {
			rel_to_binding: false,
			auto_size: true
		};
	}

	if ( prefs.auto_size ) {
		var ref_side = AutoSizingReferenceEnum.LEFT_CENTER_POINT;
		if ( prefs.rel_to_binding && mtf.parentPage.side == PageSideOptions.RIGHT_HAND ) {
			ref_side = AutoSizingReferenceEnum.RIGHT_CENTER_POINT;
		}
		mtf.textFramePreferences.autoSizingReferencePoint = ref_side;
		mtf.textFramePreferences.autoSizingType = AutoSizingTypeEnum.WIDTH_ONLY;
	}
	
	var prev = null;
	for ( var np = 0; np < doc.pages.length; np++ ) {
		var tf = place_pg_number( doc.pages[np], mtf, prefs);
		var pnr = Number( doc.pages[np].name.replace( doc.pages[np].appliedSection.name, "") );
		var pstring = getNumberString(pnr);
		if ( ! prefs.auto_size && prev ) {
			if ( np == 0 ) {
				tf.contents = pstring;
			} else {
				tf.contents = "\r" + pstring;
			}
			tf.previousTextFrame = prev;
		} else {
			tf.contents = pstring;
		}
		prev = tf;
	}
	mtf.remove();
	



	function place_pg_number( pg, mtf, prefs ) {
		var tf = mtf.duplicate( pg );
		if ( pg.side != mtf.parentPage.side ) {
			var bds = pg.bounds;
			var gb = mtf.geometricBounds;
			tf.geometricBounds = [
				gb[0],
				(bds[3]-bds[1]) - gb[3],
				gb[2],
				(bds[3]-bds[1]) - gb[1]
			];
			if ( prefs.rel_to_binding ) {
				if ( pg.side == PageSideOptions.LEFT_HAND ) {
					tf.textFramePreferences.autoSizingReferencePoint = AutoSizingReferenceEnum.LEFT_CENTER_POINT;
				} else {
					tf.textFramePreferences.autoSizingReferencePoint = AutoSizingReferenceEnum.RIGHT_CENTER_POINT;
				}
			}
		}
		return tf;
	}


}

function get_prefs() {
	var a_dialog = app.dialogs.add({name:"Beispiel"});
	var min_width_left = 160;
	var min_width_right = 250;
	with (a_dialog) {
		with (dialogColumns.add()) {
			with (borderPanels.add()) {
				with (dialogColumns.add()) {
					staticTexts.add( {staticLabel: "Position und Größe:", minWidth: min_width_left} );
				}
				with (dialogColumns.add()) {
					var the_cb1 = checkboxControls.add({staticLabel: "relativ zum Bund", checkedState: true, minWidth: min_width_right});
					var the_cb2 = checkboxControls.add({staticLabel: "automatische Breite", checkedState: true, minWidth: min_width_right});
				}
			}
		}
	}
	if (a_dialog.show() == false) {
		a_dialog.destroy();
		return null;
	} else {
		return {
			rel_to_binding: the_cb1.checkedState,
			auto_size: the_cb2.checkedState
		};
	}
}


function getNumberString(n) {
	var s ="";
	var zehndrei = n % 1000;
	var zehnsechs = Math.floor((n - zehndrei) / 1000) % 1000;
	var zehnneun = Math.floor((n - zehndrei - (zehnsechs * 1000) ) / 1000000 ) % 1000;
	if (zehnneun > 0) {
		var t = getStringBelow1000(zehnneun);
		if (t == "eins") { s += "einemillion"} else { s = s + t + "millionen" }
	}
	if (zehnsechs > 0) {
		var t = getStringBelow1000(zehnsechs);
		if (t == "eins") { s += "eintausend"} else { s = s + t + "tausend" }
	}
	s = s + getStringBelow1000(zehndrei);
	return s;
}

function getStringBelow1000(n) {
	var hStrings = new Array();
	hStrings = ["", "ein", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun"];
	var zStrings = new Array();
	zStrings = ["", "zehn", "zwanzig", "dreißig", "vierzig", "fünfzig", "sechszig", "siebzig", "achtzig", "neunzig"];
	var einer = n % 10;
	var zehner = Math.floor(n / 10) % 10;
	var hunderter = Math.floor(n / 100) % 10;
	var s = "";
	if (einer == 0 && zehner == 0) {
		s = "";
	} else if (einer == 1 && zehner == 0) {
		s = "eins";
	} else if (einer > 1 && zehner == 0) {
		s = hStrings[einer];
	} else if ( zehner == 1) {
		if (einer == 1) {
			s = "elf";
		} else if (einer == 2) {
			s = "zwölf";
		} else if (einer  == 7) {
			s = "siebzehn";
		} else {
			s = hStrings[einer] + "zehn";
		}
	} else if (einer == 0 && zehner > 0) {
		s = zStrings[zehner];
	} else {
		s = hStrings[einer] + "und" + zStrings[zehner];
	}
	if (hunderter > 0) { 
		if (s == "") {
			s = hStrings[hunderter] + "hundert"; 
		} else {
			s = hStrings[hunderter] + "hundertund" + s; 
		}
	}
	return s;
}
<script>
(function(){
 try {
  if ( /* Insert JS expression to test for product page here */ ) {
   var prodid, totalvalue;
   /*
    Insert custom JS code to extract value of
    prodid and totalvalue from current document
   */
   dataLayer.push({
    'event': 'fireRemarketingTag',
    'google_tag_params': {
      'ecomm_prodid': prodid,
      'ecomm_pagetype': 'product',
      'ecomm_totalvalue': totalvalue
    }
   });
  } else if ( /* Insert JS expression to test for cart page */ ) {
   var prodid, totalvalue;
   /*
    Insert custom JS code to extract value of
    prodid and totalvalue from current document
   */
   dataLayer.push({
    'event': 'fireRemarketingTag',
    'google_tag_params': {
      'ecomm_prodid': prodid,
      'ecomm_pagetype': 'cart',
      'ecomm_totalvalue': totalvalue
    }
   });
  }
 }
 catch (err) {}
}) ();
</script>

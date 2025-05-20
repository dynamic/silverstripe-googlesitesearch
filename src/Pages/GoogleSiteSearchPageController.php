<?php

namespace DNADesign\GoogleSiteSearch\Pages;

use SilverStripe\ORM\FieldType\DBField;
use SilverStripe\View\Requirements;

/**
 * @package googlesitesearch
 */
class GoogleSiteSearchPageController extends \PageController
{
    /**
     *
     */
    public function init()
    {
        parent::init();

        Requirements::javascript('//code.jquery.com/jquery-3.7.1.min.js');
        Requirements::javascript('dnadesign/silverstripe-googlesitesearch: javascript/uri.js');
        Requirements::javascript('dnadesign/silverstripe-googlesitesearch: javascript/googlesitesearch.js');

        Requirements::css('dnadesign/silverstripe-googlesitesearch: css/googlesitesearch.css');

        $search = $this->getRequest()->getVar('search');
        if ($search) {
            $sanitized_search_text = htmlspecialchars($search, ENT_QUOTES, 'UTF-8');
            $this->GoogleSiteSearchText = DBField::create_field(
                'HTMLText',
                $sanitized_search_text
            );
        }
    }
}

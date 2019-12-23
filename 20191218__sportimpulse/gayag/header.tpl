{**
 * 2007-2017 PrestaShop
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 * versions in the future. If you wish to customize PrestaShop for your
 * needs please refer to http://www.prestashop.com for more information.
 *
 * @author    PrestaShop SA <contact@prestashop.com>
 * @copyright 2007-2017 PrestaShop SA
 * @license   http://opensource.org/licenses/osl-3.0.php Open Software License (OSL 3.0)
 * International Registered Trademark & Property of PrestaShop SA
 *}

{block name='header_nav'}
<nav class="header-nav">
  {block name='header_banner'}
  <nav class="header_banner">
    {hook h='displayBanner'}
  </nav>
  {/block}
  <div class="container">
    <div class="row">
      <div class="hidden-sm-down">
        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 left-nav">
          {hook h='displayNav1'}
        </div>
        <div class="col-lg-4 col-md-4 col-sm-4">
          <div id="_desktop_social">
            {hook h='displayNav3'}
          </div>
        </div>
        <div class="col-lg-4 col-md-4 col-sm-4 right-nav">
          {hook h='displayNav2'}
        </div>
      </div>
      <div class="hidden-md-up text-xs-center mobile">
        <div class="pull-xs-left" id="menu-icon">
          <i class="material-icons d-inline">&#xE5D2;</i>
        </div>
        <div class="pull-xs-right" id="_mobile_cart"></div>
        <div class="top-logo" id="_mobile_logo"></div>
        <div class="pull-xs-right search-widget" id="_mobile_search_widget"></div>
        <div class="clearfix"></div>
      </div>
    </div>
  </div>
</nav>
{/block}

{block name='header_top'}
<div class="header-top">

  {if Module::isEnabled('an_theme') && Module::getInstanceByName('an_theme')->getParam('header_logoMiddle') == '1'}
  <div class="hidden-sm-down" id="_desktop_logo">
    {else}
    <div class="hidden-sm-down" id="_desktop_logo">
      {/if}
      <a href="{$urls.base_url}">
        <img class="logo img-responsive" src="{$shop.logo}" alt="{$shop.name}">
      </a>
    </div>
    {if Module::isEnabled('an_theme') && Module::getInstanceByName('an_theme')->getParam('header_logoMiddle') == '1'}
    <div class="navigation position-static">
      {else}
      <div class="navigation position-static">
        {/if}
        <div class="container">
          <div class="row">
            {hook h='displayTop'}
            <div class="clearfix"></div>
          </div>
        </div>
      </div>
    </div>
    <div id="mobile_top_menu_wrapper" class="hidden-md-up" style="display:none;">
      <div class="js-top-menu mobile" id="_mobile_top_menu"></div>
      <div class="js-top-menu-bottom">
        {hook h='displayMobileMenu'}
        <div class="" id="_mobile_user_info"></div>
        <div id="_mobile_social"></div>
        <div id="_mobile_currency_selector"></div>
        <div id="_mobile_language_selector"></div>
        <div id="_mobile_an_wishlist-nav"></div>
        <div id="_mobile_contact_link"></div>

      </div>
    </div>
  </div>
{hook h='displayNavFullWidth'}
{/block}
{if $page.page_name == 'index'}
{hook h='displaySliderFullWidth'}
{/if}

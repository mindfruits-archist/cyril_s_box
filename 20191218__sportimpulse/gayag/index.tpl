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
{extends file='page.tpl'}

    {block name='page_content_container'}
      <section id="content" class="page-home">
		{hook h='displaySliderContainerWidth'}
		{hook h='displayHomeBefore'}
        {block name='page_content_top'}{/block}

        {block name='page_content'}
          {block name='hook_home'}
            {$HOOK_HOME nofilter}
          {/block}
        {/block}
    <div class="columns-anthemeblocks-1">
      <div class="row">
        <div class="col-lg-1 col-md-1">
          {hook h='displaySaleBanner'}
        </div>
        <div class="col-lg-10 col-md-10 col-xs-12">
          {hook h='displayEmailSubs'}
        </div>
        <div class="col-lg-1 col-md-1">
        </div>
      </div>
    </div>
		{hook h='displayHomeAfter'}
    <div class="columns-anthemeblocks-2">
      <div class="row">
        <div class="col-md-6">
          {hook h='displayAccordeonBlock'}
        </div>
        <div class="col-md-6">
          {hook h='displayReviewsBlock'}
        </div>
      </div>
    </div>
      </section>
    {/block}

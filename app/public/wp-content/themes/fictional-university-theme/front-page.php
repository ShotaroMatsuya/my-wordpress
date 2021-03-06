<?php get_header(); ?>

<div class="page-banner">
    <div class="page-banner__bg-image" style="background-image: url(<?php echo get_theme_file_uri('/images/library-hero.jpg') ?>);"></div>
    <div class="page-banner__content container t-center c-white">
        <h1 class="headline headline--large" style="font-weight:bold;">妥協せず誠実であれ</h1>
        <h2 class="headline headline--medium">Without Compromise, Be Honest.</h2>
        <h3 class="headline headline--small">学習を継続しましょう</h3>
        <a href="<?php echo get_post_type_archive_link('program') ?>" class="btn btn--large btn--blue">Find Your Major</a>
    </div>
</div>

<div class="full-width-split group">
    <div class="full-width-split__one">
        <div class="full-width-split__inner">
            <h2 class="headline headline--small-plus t-center">イベント情報</h2>
            <?php
            $today = date('Ymd'); /*現在日時 */
            $homepageEvents = new WP_Query(array(  /* custom-queryを作成 (デフォルトだとtypeがpostになっている) */
                'posts_per_page' => 2,
                'post_type' => 'event',
                'meta_key' => 'event_date', /*カスタムフィールド名 */
                'orderby' => 'meta_value_num', /* カスタムフィールドのvalue(デフォルトだとpost_date) */
                'order' => 'ASC',     /*昇順 */
                'meta_query' => array(     /*filterを設定 */
                    array( /*todayよりも先のものだけ表示 */
                        'key' => 'event_date',
                        'compare' => '>=',
                        'value' => $today,
                        'type' => 'numeric'

                    )
                )
            ));

            while ($homepageEvents->have_posts()) {
                $homepageEvents->the_post();
                get_template_part('template-parts/content', 'event');
            }
            ?>
            <p class="t-center no-margin"><a href="<?php echo get_post_type_archive_link('event'); ?>" class="btn btn--blue">View All Events</a></p> <!-- archive.event.phpへのリンク -->
        </div>
    </div>
    <div class="full-width-split__two">
        <div class="full-width-split__inner">
            <h2 class="headline headline--small-plus t-center">最新情報</h2>

            <?php

            $homepagePosts = new WP_Query(array( /*カスタムクエリを作成 */
                'posts_per_page' => 2,

            ));

            while ($homepagePosts->have_posts()) {
                $homepagePosts->the_post(); ?>
                <div class="event-summary">
                    <a class="event-summary__date t-center" href="<?php the_permalink(); ?>">
                        <span class="event-summary__month"><?php the_time('M'); ?></span>
                        <span class="event-summary__day"><?php the_time('d') ?></span>
                    </a>
                    <div class="event-summary__content">
                        <h5 class="event-summary__title headline headline--tiny">
                            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                        </h5>
                        <p><?php if (has_excerpt()) {
                                echo get_the_excerpt();
                            } else {
                                echo wp_trim_words(get_the_content(), 18);
                            }; ?>
                            <a href="<?php the_permalink(); ?>" class="nu gray">Learn more</a>
                        </p>
                    </div>
                </div>
            <?php  }
            wp_reset_postdata(); /*メインクエリ以外のクエリをwhile loopのあとにこれを指定するのがbest practice */
            ?>

            <p class="t-center no-margin"><a href="<?php echo site_url('/blog'); ?>" class="btn btn--yellow">View All Blog Posts</a></p>
        </div>
    </div>
</div>

<div class="hero-slider">
    <div data-glide-el="track" class="glide__track">
        <div class="glide__slides">
            <div class="hero-slider__slide" style="background-image: url(<?php echo get_theme_file_uri('/images/bus.jpg') ?>);">
                <div class="hero-slider__interior container">
                    <div class="hero-slider__overlay">
                        <h2 class="headline headline--medium t-center">交通費無料</h2>
                        <p class="t-center">すべての学生はバス料金が無料です。</p>
                        <p class="t-center no-margin"><a href="#" class="btn btn--blue">Learn more</a></p>
                    </div>
                </div>
            </div>
            <div class="hero-slider__slide" style="background-image: url(<?php echo get_theme_file_uri('/images/apples.jpg') ?>);">
                <div class="hero-slider__interior container">
                    <div class="hero-slider__overlay">
                        <h2 class="headline headline--medium t-center">An Apple Day</h2>
                        <p class="t-center">学祖：<strong>象川=エレファ=蔵造</strong>の命日はリンゴの食べ放題の日です</p>
                        <p class="t-center no-margin"><a href="#" class="btn btn--blue">Learn more</a></p>
                    </div>
                </div>
            </div>
            <div class="hero-slider__slide" style="background-image: url(<?php echo get_theme_file_uri('/images/bread.jpg') ?>);">
                <div class="hero-slider__interior container">
                    <div class="hero-slider__overlay">
                        <h2 class="headline headline--medium t-center">学生食堂</h2>
                        <p class="t-center">架空保健医療大学では、健康に配慮しオーガニック食材を学生食堂にて提供しています。</p>
                        <p class="t-center no-margin"><a href="#" class="btn btn--blue">Learn more</a></p>
                    </div>
                </div>
            </div>
        </div>
        <div class="slider__bullets glide__bullets" data-glide-el="controls[nav]"></div>
    </div>
</div>



<?php get_footer(); ?>
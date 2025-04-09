<div class="container">
    <div id="g_cse" data-key="$CseKey" data-cx="$CseCx" data-domain="$GoogleDomain">
        <div class="g_cse_results_header">
            <h1>$Title</h1>
        </div>

        <div id="g_cse_search_form">
            <input type="text" id="g_cse_search_form__input"
                   name="g_cse_search_input"
                   placeholder="Search $Title"
                   value="$SearchTerm"
                   aria-label="Search $Title"
                   class="g_cse_search_input"/>
        </div>

        <div id="g_cse_results" class="results_loading">
            <ul class="result_refinements"></ul>
            <ul class="result_list"></ul>

            <div class="result_error">
                <h4>Sorry could not connect to search server. Please try again.</h4>
            </div>

            <div class="result_empty">
                <h4>No results matching that query found. Try another search keyword.</h4>
            </div>

            <div class="result_nosearchterm">
                <h4>Enter a search term to see results.</h4>
            </div>
        </div>
    </div>

    <!-- Script templates for safeTmpl -->

    <script type="text/html" id="pre_result_tmpl">
        <p class="results_showing">
            Showing results {{=queries.request.0.startIndex}} - {{=queries.request.0.count}} of
            {{=queries.request.0.totalResults}} results.
        </p>
    </script>

    <script type="text/html" id="result_tmpl">
        <li>
            <h4><a href="{{=link}}">{{=title}}</a></h4>
            <p class="result_meta"><a href="{{=link}}">{{=htmlFormattedUrl}}</a></p>
            <p>{{=htmlSnippet}}</p>
        </li>
    </script>

    <script type="text/html" id="previous_link_tmpl">
        <div class="results_pagination">
            <p class="results_previous"><a href="{{=previousLink}}">Previous Page</a></p>
        </div>
    </script>

    <script type="text/html" id="next_link_tmpl">
        <div class="results_pagination">
            <p class="results_next"><a href="{{=nextLink}}">Next Page</a></p>
        </div>
    </script>

    <script type="text/html" id="refinement_tmpl">
        <a href="{{=link}}" class="{{=activeClass}}">{{=anchor}}</a>
    </script>
</div>

Title: One click website deployment with octopress
Date: 2013-06-20 00:13
Category: Blog
Slug: one-click-website-deployment-with-octopress

<p>I have been thinking to revamp the site for quite sometime and finally got around it. The old version was hosted on github, courtesy github pages which was a fairly simple one page setup, with links to my blog, github repository etc. For the new site, I needed to have one place to maintain the blogposts and webpages, so I started looking for jekyll style static page generators so that I can keep using github for hosting (for free! :D ) and really liked what <a href="http://octopress.org/">Octopress</a> had to offer.</p>

<p>I have the website hosted on mohitranka.github.com (see <a href="https://help.github.com/articles/creating-pages-with-the-automatic-generator">here</a> on how to do it and mohitranka.com is merely a CNAME for it).</p>

<h2>Hello Octopress!</h2>

<p>Octopress is a blogging framework written on top of <a href="http://jekyllrb.com/">Jekyll</a>. It has nifty little commands to create new pages and posts using <a href="http://daringfireball.net/projects/markdown/">markdown</a>, growing number of <a href="http://octopressthemes.com/">themes and plugins</a>, which are everything you need for your static content based website.</p>

<!--more-->


<p>On your Ubuntu 13.04 machine, the following commands will let you publish your first page and blog post from octopress to github!</p>

<h3>Install Git</h3>

<figure class='code'><div class="highlight"><table><tr><td class="gutter"><pre class="line-numbers"><span class='line-number'>1</span>
</pre></td><td class='code'><pre><code class=''><span class='line'>sudo apt-get install git</span></code></pre></td></tr></table></div></figure>


<h3>Install RVM to use ruby 1.9.3</h3>

<figure class='code'><div class="highlight"><table><tr><td class="gutter"><pre class="line-numbers"><span class='line-number'>1</span>
<span class='line-number'>2</span>
<span class='line-number'>3</span>
<span class='line-number'>4</span>
</pre></td><td class='code'><pre><code class=''><span class='line'>curl -L https://get.rvm.io | bash -s stable --ruby
</span><span class='line'>sudo rvm install 1.9.3
</span><span class='line'>sudo rvm use 1.9.3
</span><span class='line'>sudo rvm rubygems latest</span></code></pre></td></tr></table></div></figure>


<h3>Add the rvm to ~/.bashrc</h3>

<figure class='code'><div class="highlight"><table><tr><td class="gutter"><pre class="line-numbers"><span class='line-number'>1</span>
</pre></td><td class='code'><pre><code class=''><span class='line'>source ~/.rvm/scripts/rvm</span></code></pre></td></tr></table></div></figure>


<h3>Setup Octopress</h3>

<figure class='code'><div class="highlight"><table><tr><td class="gutter"><pre class="line-numbers"><span class='line-number'>1</span>
<span class='line-number'>2</span>
<span class='line-number'>3</span>
</pre></td><td class='code'><pre><code class=''><span class='line'>git clone git://github.com/imathis/octopress.git my-website
</span><span class='line'>cd my-website    # If you use RVM, You'll be asked if you trust the .rvmrc file (say yes).
</span><span class='line'>ruby --version  # Should report Ruby 1.9.3</span></code></pre></td></tr></table></div></figure>


<h3>Install Octopress dependencies</h3>

<figure class='code'><div class="highlight"><table><tr><td class="gutter"><pre class="line-numbers"><span class='line-number'>1</span>
<span class='line-number'>2</span>
</pre></td><td class='code'><pre><code class=''><span class='line'>sudo gem install bundler
</span><span class='line'>sudo bundle install</span></code></pre></td></tr></table></div></figure>


<h3>Install the default Octopress theme</h3>

<figure class='code'><div class="highlight"><table><tr><td class="gutter"><pre class="line-numbers"><span class='line-number'>1</span>
</pre></td><td class='code'><pre><code class=''><span class='line'>rake install</span></code></pre></td></tr></table></div></figure>


<h3>Point Octopress to talk to username.github.io</h3>

<p>You need to have machine&rsquo;s SSH public key added to your github account for this. See <a href="https://help.github.com/articles/generating-ssh-keys">this</a> on how to do it.</p>

<p>Once your SSH public key is added and machine&rsquo;s access to your github account has been validated, run the following commands.</p>

<figure class='code'><div class="highlight"><table><tr><td class="gutter"><pre class="line-numbers"><span class='line-number'>1</span>
<span class='line-number'>2</span>
</pre></td><td class='code'><pre><code class=''><span class='line'>cd /path/to/my-website
</span><span class='line'>rake setup_github_pages</span></code></pre></td></tr></table></div></figure>


<p>This asks for your github repository. Type (quotes for clarity only) &ldquo;git@github.com:username/username.github.io.git&rdquo; and hit return key. Now, you are ready to make deploy your site to github. well&hellip; almost!</p>

<h3>One-click (well.. command) settings.</h3>

<p>Put the following aliases in your ~/.bashrc file.</p>

<figure class='code'><div class="highlight"><table><tr><td class="gutter"><pre class="line-numbers"><span class='line-number'>1</span>
<span class='line-number'>2</span>
</pre></td><td class='code'><pre><code class=''><span class='line'>alias deploy_site='rake clean && rake generate && rake deploy'
</span><span class='line'>alias preview_site='rake clean && rake generate && rake preview'</span></code></pre></td></tr></table></div></figure>


<h3>Install a new theme</h3>

<p>I am not a big fan of the default theme, so I looked around. I really liked mattgemmell.com, so I &ldquo;inspired&rdquo; myself to use the same theme he used!</p>

<figure class='code'><div class="highlight"><table><tr><td class="gutter"><pre class="line-numbers"><span class='line-number'>1</span>
<span class='line-number'>2</span>
<span class='line-number'>3</span>
<span class='line-number'>4</span>
</pre></td><td class='code'><pre><code class=''><span class='line'>cd /path/to/my-website
</span><span class='line'>git submodule add https://github.com/rastersize/BlogTheme.git .themes/BlogTheme
</span><span class='line'>git submodule update --init
</span><span class='line'>rake install\[BlogTheme\]</span></code></pre></td></tr></table></div></figure>


<p>And voila! Our website uses a new theme now</p>

<h3>Create a new post</h3>

<p>Run the following commands to create a new blog post. You can use new_page command to create a new page instead, as well.</p>

<figure class='code'><div class="highlight"><table><tr><td class="gutter"><pre class="line-numbers"><span class='line-number'>1</span>
<span class='line-number'>2</span>
</pre></td><td class='code'><pre><code class=''><span class='line'>cd /path/to/my-website
</span><span class='line'>rake new_post["My first post using Octopress"]</span></code></pre></td></tr></table></div></figure>


<p>This is create a file named &lsquo;/path/to/my-website/source/_posts/yyyy-mm-dd-my-first-post-using-octopress.markdown&rsquo;. You can refer markdown documentation on how to format it or use a WYSIWYG to Markdown editor. I suggest using <a href="http://personal-editor.com/">http://personal-editor.com/</a> if you are not comfortable with markdown.</p>

<figure class='code'><div class="highlight"><table><tr><td class="gutter"><pre class="line-numbers"><span class='line-number'>1</span>
</pre></td><td class='code'><pre><code class=''><span class='line'>echo "My first post content" >> /path/to/my-website/source/_posts/yyyy-mm-dd-my-first-post-using-octopress.markdown</span></code></pre></td></tr></table></div></figure>


<p>This will write a line of content in the newly created blog post.</p>

<h3>Preview the website</h3>

<p>Remember we put few aliases in ~/.bashrc? We can now use them to preview and publish the content using those commands</p>

<figure class='code'><div class="highlight"><table><tr><td class="gutter"><pre class="line-numbers"><span class='line-number'>1</span>
<span class='line-number'>2</span>
</pre></td><td class='code'><pre><code class=''><span class='line'>cd /path/to/my-website
</span><span class='line'>preview_site</span></code></pre></td></tr></table></div></figure>


<p>You can point your browser to <a href="http://localhost:4000">http://localhost:4000</a> to see the website homepage. You can see the blog post we just wrote at <a href="http://localhost:4000/blog/yyyy/mm/dd/my-first-post-using-octopress/.">http://localhost:4000/blog/yyyy/mm/dd/my-first-post-using-octopress/.</a> Modify the markdown file, save, reload browser to see the update in the preview, repeat till you are happy with the finished article.</p>

<h3>Deploying the website</h3>

<p>Whenever you have made any change in the website (added a new blog post, deleted an existing page, modified content or stylesheet etc.), you can run the the following command to deploy the changes live to your github hosting!</p>

<figure class='code'><div class="highlight"><table><tr><td class="gutter"><pre class="line-numbers"><span class='line-number'>1</span>
<span class='line-number'>2</span>
</pre></td><td class='code'><pre><code class=''><span class='line'>cd /path/to/my-website
</span><span class='line'>deploy_site</span></code></pre></td></tr></table></div></figure>


<p>And thats it! In few minutes after deployment, github will start showing the updated content on your live site!</p>


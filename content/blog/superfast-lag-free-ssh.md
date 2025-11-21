Title: Superfast lag-free SSH
Date: 2013-07-02 16:06
Category: Blog
Slug: superfast-lag-free-ssh

<p>A tip to speed up commands on ssh significantly, especially for long running sessions.
(Note &ndash; All the instructions are only for Ubuntu 12.04)</p>

<ol>
<li>Put the following in ~/.ssh/config</li>
</ol>


<figure class='code'><div class="highlight"><table><tr><td class="gutter"><pre class="line-numbers"><span class='line-number'>1</span>
<span class='line-number'>2</span>
<span class='line-number'>3</span>
<span class='line-number'>4</span>
</pre></td><td class='code'><pre><code class=''><span class='line'> Host *
</span><span class='line'>    ControlMaster auto
</span><span class='line'>    ControlPath ~/.ssh/auth/%r@%h:%p
</span><span class='line'>    ControlPersist yes</span></code></pre></td></tr></table></div></figure>


<ol>
<li>chmod 600 ~/.ssh/config</li>
<li>mkdir ~/.ssh/auth</li>
</ol>


<p>and Voila!</p>

<p>In my testing, the ssh connect and exit time to a test instance, dropped from 5.25-5.28 sec to 0.84-0.87 sec.</p>


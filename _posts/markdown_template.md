---
layout: post
title: "Hello, world (and a Markdown cheat sheet)"
math: true
---

First post on the native blog - technical writing lives here now, personal
rants stay on Notion. This post doubles as a reference for the syntax,
delete it whenever.

## Writing a post

Create `_posts/YYYY-MM-DD-some-title.md` with the frontmatter block you see
at the top of this file, write standard Markdown below it, push. GitHub
Pages rebuilds the site automatically; the post shows up at
`/blog/YYYY/some-title/` and on the blog index.

## Images

Standard Markdown syntax. Put post images in `images/blog/` and reference
them with an absolute path:

```markdown
![Tokyo Tower at night](/images/blog/tokyo-tower.jpg)
```

![Tokyo Tower at night](/images/2025-Japan/img1.jpg)

## Code

Fenced code blocks with a language get syntax highlighting:

```verilog
module counter #(parameter W = 8) (
    input  logic         clk, rst_n,
    output logic [W-1:0] count
);
    always_ff @(posedge clk or negedge rst_n)
        if (!rst_n) count <= '0';
        else        count <= count + 1'b1;
endmodule
```

## Math

Because this post sets `math: true` in its frontmatter, MathJax renders
LaTeX: inline like $P = \alpha C V_{DD}^2 f$, or display equations:

$$ E_{dyn} = \int_0^{T} \alpha(t) \, C \, V_{DD}^2 \, f \, dt $$

Leave `math: true` out of posts that don't need it and the page stays
script-free.

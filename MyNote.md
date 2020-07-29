1. when you use git to commit, maybe you will input commit message in vim. you need to press ESC to quit the edit model ,then press :w to save ,then press :q to quit
2 how to use git it vscode:
https://zhuanlan.zhihu.com/p/23344403
3 git reset --soft HEAD^ 
quit your last commit,注意，仅仅是撤回commit操作，您写的代码仍然保留。HEAD^的意思是上一个版本，也可以写成HEAD~1

如果你进行了2次commit，想都撤回，可以使用HEAD~2
4 GitLens 插件，管理git提交
5 highcharts with large set,heatmap
https://www.highcharts.com/forum/viewtopic.php?t=36417
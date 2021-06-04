/*
 * @Description: 工具方法库
 * @Author: tourist17846
 * @Date: 2021-04-26 23:18:06
 * @LastEditTime: 2021-06-04 17:35:36
 */

import * as chalk from 'chalk';
import * as childProcess from 'child_process';
import { CLI_VOID, COLOR_CLI } from './def';


const { execSync } = childProcess;

const colors: string[] = ['green', 'blue', 'yellow', 'red'];
const colorCli: { [keyName: string]: CLI_VOID } = {};

export default {
  /**
   * @name: colorCli
   * @description: 返回多色命令行方法
   * @return {object} COLOR_CLI
   */
  colorCli(): COLOR_CLI {
    if (colorCli.length) {
      return colorCli;
    } else {
      colors.forEach(item => {
        colorCli[item] = (text: string, isConsole = true): unknown => {
          return isConsole
            ? console.log(chalk[item](text))
            : chalk[item](text);
        }
      });

      return colorCli;
    }
  },
  /**
   * @name: getInfoFromExecSync
   * @description: 返回执行cmd命令获得的结果
   * @param {string} cmd
   * @return {string}
   */
  getInfoFromExecSync: (cmd: string): string => execSync(cmd).toString().trim(),
}
import { createBuilder, BuilderContext, targetFromTargetString } from '@angular-devkit/architect';
import { executeBrowserBuilder } from '@angular-devkit/build-angular';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

const notifier = require('node-notifier');

async function devBuildWithNotification(
  options: any,
  context: BuilderContext
): Promise<any> {
  let projectName = context.target!.project;

  const sourceTarget = targetFromTargetString(context.target!.project + ':build');
  let buildOptions = await context.getTargetOptions(sourceTarget);
  buildOptions.logging = { level: 'debug' };
  buildOptions.watch = true;

  context.target!.configuration = 'development';

  return (executeBrowserBuilder(buildOptions as any, context) as any).pipe(
    tap((buildResult: any) => {
      if (buildResult.success) {
        notifier.notify(projectName + ' build successful');
      } else {
        notifier.notify(projectName + ' build failed');
      }
    }),
    catchError(error => {
      notifier.notify(projectName + ' build ERROR');
      console.error('Error occurred:', error);
      return of({ success: false });
    })
  );
}

export default createBuilder(devBuildWithNotification);

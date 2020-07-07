import { FileNameResolver as FileNameResolverDefinition } from '.';
import { PlatformContext } from '../../module-name-resolver/qualifier-matcher';
import { screen, Device } from '../../platform';
import { path as fsPath, Folder, File } from '..';
import { Trace } from '../../trace';
import * as appCommonModule from '../../application/application-common';

import { findMatch, stripQualifiers } from '../../module-name-resolver/qualifier-matcher';

export class FileNameResolver implements FileNameResolverDefinition {
  private _context: PlatformContext;
  private _cache = {};

  constructor(context: PlatformContext) {
    console.log('FileNameResolver is deprecated; use ModuleNameResolver instead');

    this._context = context;
  }

  public resolveFileName(path: string, ext: string): string {
    const key = path + ext;
    let result: string = this._cache[key];
    if (result === undefined) {
      result = this.resolveFileNameImpl(path, ext);
      this._cache[key] = result;
    }

    return result;
  }

  public clearCache(): void {
    this._cache = {};
  }

  private resolveFileNameImpl(path: string, ext: string): string {
    let result: string = null;
    path = fsPath.normalize(path);
    ext = '.' + ext;

    // This call will return a clean path without qualifiers
    path = stripQualifiers(path);

    const candidates = this.getFileCandidatesFromFolder(path, ext);
    result = findMatch(path, ext, candidates, this._context);

    return result;
  }

  private getFileCandidatesFromFolder(path: string, ext: string): Array<string> {
    const candidates = new Array<string>();
    const folderPath = path.substring(0, path.lastIndexOf(fsPath.separator) + 1);

    if (Folder.exists(folderPath)) {
      const folder = Folder.fromPath(folderPath);
      folder.eachEntity((e) => {
        if (e instanceof File) {
          const file = e;
          if (file.path.indexOf(path) === 0 && file.extension === ext) {
            candidates.push(file.path);
          }
        }

        return true;
      });
    } else {
      if (Trace.isEnabled()) {
        Trace.write('Could not find folder ' + folderPath + ' when loading ' + path + ext, Trace.categories.Navigation);
      }
    }

    return candidates;
  }
}

let resolverInstance: FileNameResolver;

export function resolveFileName(path: string, ext: string): string {
  if (!resolverInstance) {
    resolverInstance = new FileNameResolver({
      width: screen.mainScreen.widthDIPs,
      height: screen.mainScreen.heightDIPs,
      os: Device.os,
      deviceType: Device.deviceType,
    });
  }

  return resolverInstance.resolveFileName(path, ext);
}
export function clearCache() {
  if (resolverInstance) {
    resolverInstance.clearCache();
  }
}

appCommonModule.on('cssChanged', (args) => (resolverInstance = undefined));
appCommonModule.on('livesync', (args) => clearCache());
